import { Role, UserStatus, type Prisma } from "@prisma/client";

import type { AuthenticatedAppUser } from "@/lib/auth/get-current-user";
import { requireOrganizationAccess } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { adminSearchSchema, userInviteSchema, userUpdateSchema } from "@/lib/admin/schemas";

function orgWhere(user: AuthenticatedAppUser) {
  return user.role === "SUPER_ADMIN" ? {} : { organizationId: user.organizationId };
}

function scopedOrganizationId(user: AuthenticatedAppUser) {
  return user.organizationId;
}

export async function getAdminDashboardData(user: AuthenticatedAppUser) {
  const organizationId = scopedOrganizationId(user);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalPartners,
    activeUsers,
    courses,
    resources,
    leads,
    communityPosts,
    notificationsSent,
    todaysActivity,
    recentActivity,
    latestLeads,
    latestCommunityPosts,
    pendingTasks,
  ] = await Promise.all([
    prisma.user.count({ where: { organizationId, role: Role.PARTNER } }),
    prisma.user.count({ where: { organizationId, status: UserStatus.ACTIVE } }),
    prisma.course.count({ where: { organizationId } }),
    prisma.resource.count({ where: { organizationId } }),
    prisma.lead.count({ where: { organizationId, isArchived: false } }),
    prisma.communityPost.count({ where: { organizationId, deletedAt: null } }),
    prisma.notification.count({ where: { organizationId } }),
    prisma.activityLog.count({ where: { organizationId, createdAt: { gte: today } } }),
    prisma.activityLog.findMany({
      where: { organizationId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.lead.findMany({
      where: { organizationId, isArchived: false },
      select: { id: true, businessName: true, clientName: true, status: true, requestedAmount: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.communityPost.findMany({
      where: { organizationId, deletedAt: null, isHidden: false },
      include: { author: { select: { id: true, name: true } }, space: { select: { name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.reportedContent.findMany({
      where: { organizationId, status: "OPEN" },
      include: { reporter: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return {
    metrics: { totalPartners, activeUsers, courses, resources, leads, communityPosts, notificationsSent, todaysActivity },
    recentActivity,
    latestLeads,
    latestCommunityPosts,
    pendingTasks,
  };
}

export async function getAdminUsers(user: AuthenticatedAppUser, search: Record<string, string | undefined> = {}) {
  const query = search.query?.trim();
  const role = search.role?.trim();
  const status = search.status?.trim();
  const where: Prisma.UserWhereInput = { ...orgWhere(user) };

  if (query) {
    where.OR = [
      { name: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
    ];
  }

  if (role && role in Role) {
    where.role = role as Role;
  }

  if (status && status in UserStatus) {
    where.status = status as UserStatus;
  }

  return prisma.user.findMany({
    where,
    include: {
      submittedLeads: { select: { id: true } },
      lessonProgressRecords: { select: { id: true, status: true } },
      organization: { select: { id: true, name: true } },
    },
    orderBy: [{ status: "asc" }, { name: "asc" }],
    take: 50,
  });
}

export async function inviteAdminUser(user: AuthenticatedAppUser, payload: unknown) {
  const parsed = userInviteSchema.parse(payload);
  const created = await prisma.user.create({
    data: {
      organizationId: scopedOrganizationId(user),
      name: parsed.name,
      email: parsed.email,
      role: parsed.role,
      status: UserStatus.INVITED,
    },
  });

  await prisma.activityLog.create({
    data: {
      organizationId: created.organizationId,
      userId: user.id,
      action: "admin.user.invited",
      entityType: "user",
      entityId: created.id,
      metadata: { description: `${user.name} invited ${created.name}` },
    },
  });

  return created;
}

export async function updateAdminUser(user: AuthenticatedAppUser, userId: string, payload: unknown) {
  const parsed = userUpdateSchema.parse(payload);
  const target = await prisma.user.findUnique({ where: { id: userId } });

  if (!target) {
    throw new Error("User not found.");
  }

  requireOrganizationAccess(user, target.organizationId);

  const status = parsed.action === "SUSPEND" ? UserStatus.SUSPENDED : parsed.action === "ACTIVATE" ? UserStatus.ACTIVE : parsed.status;
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role: parsed.role, status },
  });

  await prisma.activityLog.create({
    data: {
      organizationId: target.organizationId,
      userId: user.id,
      action: parsed.role ? "admin.user.role_changed" : `admin.user.${(parsed.action || "updated").toLowerCase()}`,
      entityType: "user",
      entityId: target.id,
      metadata: { description: `${user.name} updated ${target.name}` },
    },
  });

  return updated;
}

export async function getAdminPartners(user: AuthenticatedAppUser) {
  const organizationId = scopedOrganizationId(user);

  return prisma.user.findMany({
    where: { organizationId, role: { in: [Role.PARTNER, Role.PARTNER_MANAGER] } },
    include: {
      submittedLeads: { select: { id: true, status: true } },
      lessonProgressRecords: { select: { id: true, status: true } },
      organization: { select: { name: true } },
    },
    orderBy: [{ lastLoginAt: "desc" }, { name: "asc" }],
    take: 40,
  });
}

export async function getAdminOrganizationData(user: AuthenticatedAppUser) {
  const organization = await prisma.organization.findUnique({
    where: { id: scopedOrganizationId(user) },
    include: {
      _count: { select: { users: true, resources: true, leads: true, communityPosts: true } },
    },
  });

  if (!organization) {
    throw new Error("Organization not found.");
  }

  return organization;
}

export async function getAdminSettingsData(user: AuthenticatedAppUser) {
  const [organization, auditLogs] = await Promise.all([
    getAdminOrganizationData(user),
    prisma.activityLog.findMany({
      where: { organizationId: scopedOrganizationId(user) },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
  ]);

  return { organization, auditLogs };
}

export async function adminGlobalSearch(user: AuthenticatedAppUser, payload: unknown) {
  const { query } = adminSearchSchema.parse(payload);
  const organizationId = scopedOrganizationId(user);
  const contains = { contains: query, mode: "insensitive" as const };

  const [users, courses, resources, leads, posts] = await Promise.all([
    prisma.user.findMany({ where: { organizationId, OR: [{ name: contains }, { email: contains }] }, select: { id: true, name: true, email: true }, take: 5 }),
    prisma.course.findMany({ where: { organizationId, title: contains }, select: { id: true, title: true, slug: true }, take: 5 }),
    prisma.resource.findMany({ where: { organizationId, title: contains }, select: { id: true, title: true, category: true }, take: 5 }),
    prisma.lead.findMany({ where: { organizationId, OR: [{ businessName: contains }, { clientName: contains }, { clientEmail: contains }] }, select: { id: true, businessName: true, clientName: true }, take: 5 }),
    prisma.communityPost.findMany({ where: { organizationId, OR: [{ title: contains }, { body: contains }], deletedAt: null }, select: { id: true, title: true }, take: 5 }),
  ]);

  return { users, courses, resources, leads, posts };
}
