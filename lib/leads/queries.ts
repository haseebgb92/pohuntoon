import type { LeadStatus, Prisma, Role } from "@prisma/client";

import { requireActiveUser, requireAdmin, requireOrganizationAccess, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser, type AuthenticatedAppUser } from "@/lib/auth/get-current-user";
import { adminRoles } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db/prisma";
import { leadBoardColumns, leadStatusProgress } from "@/lib/leads/config";
import { leadFilterSchema } from "@/lib/leads/schemas";
import { getCurrentUserNotifications } from "@/lib/notifications/service";

function canManageOrganizationLeads(role: Role) {
  return adminRoles.includes(role);
}

function buildLeadAccessWhere(user: AuthenticatedAppUser): Prisma.LeadWhereInput {
  if (canManageOrganizationLeads(user.role)) {
    return user.role === "SUPER_ADMIN" ? {} : { organizationId: user.organizationId };
  }

  return {
    organizationId: user.organizationId,
    submittedById: user.id,
  };
}

function buildLeadListWhere(
  user: AuthenticatedAppUser,
  filters: ReturnType<typeof leadFilterSchema.parse>,
): Prisma.LeadWhereInput {
  const where: Prisma.LeadWhereInput = {
    ...buildLeadAccessWhere(user),
  };

  if (filters.status !== "all") {
    where.status = filters.status;
  }

  if (filters.archived === "active") {
    where.isArchived = false;
  } else if (filters.archived === "archived") {
    where.isArchived = true;
  }

  if (filters.assigned === "assigned") {
    where.assignedManagerId = { not: null };
  } else if (filters.assigned === "unassigned") {
    where.assignedManagerId = null;
  }

  if (filters.query) {
    where.OR = [
      { businessName: { contains: filters.query, mode: "insensitive" } },
      { clientName: { contains: filters.query, mode: "insensitive" } },
      { clientEmail: { contains: filters.query, mode: "insensitive" } },
      { industry: { contains: filters.query, mode: "insensitive" } },
    ];
  }

  return where;
}

const leadListInclude = {
  assignedManager: {
    select: { id: true, name: true },
  },
  submittedBy: {
    select: { id: true, name: true, email: true },
  },
  _count: {
    select: { documents: true, leadNotes: true },
  },
} satisfies Prisma.LeadInclude;

export async function getPartnerLeadLibrary(search: Record<string, string | undefined>) {
  const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_own_leads");
  const filters = leadFilterSchema.parse(search);

  const leads = await prisma.lead.findMany({
    where: buildLeadListWhere(user, filters),
    include: leadListInclude,
    orderBy: [{ lastActivityAt: "desc" }, { updatedAt: "desc" }],
    take: 50,
  });

  return { user, filters, leads };
}

export async function getAdminLeadLibrary(search: Record<string, string | undefined>) {
  const user = requirePermission(requireAdmin(requireActiveUser(await getCurrentUser())), "manage_leads");
  const filters = leadFilterSchema.parse(search);

  const leads = await prisma.lead.findMany({
    where: buildLeadListWhere(user, filters),
    include: leadListInclude,
    orderBy: [{ lastActivityAt: "desc" }, { updatedAt: "desc" }],
    take: 100,
  });

  const managers = await prisma.user.findMany({
    where: {
      organizationId: user.organizationId,
      role: { in: ["ORG_ADMIN", "PARTNER_MANAGER", "SUPER_ADMIN"] },
      status: "ACTIVE",
    },
    select: { id: true, name: true },
    orderBy: [{ name: "asc" }],
  });

  return { user, filters, leads, managers };
}

export async function getLeadById(leadId: string) {
  const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_own_leads");
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      assignedManager: { select: { id: true, name: true, email: true } },
      submittedBy: { select: { id: true, name: true, email: true } },
      documents: {
        include: {
          uploadedBy: { select: { id: true, name: true } },
          note: { select: { id: true } },
        },
        orderBy: [{ createdAt: "desc" }],
      },
      leadNotes: {
        where: canManageOrganizationLeads(user.role)
          ? undefined
          : { noteType: "PARTNER" },
        include: {
          author: { select: { id: true, name: true, email: true } },
          documents: {
            include: {
              uploadedBy: { select: { id: true, name: true } },
            },
            orderBy: [{ createdAt: "asc" }],
          },
          replies: {
            include: {
              author: { select: { id: true, name: true, email: true } },
              documents: {
                include: {
                  uploadedBy: { select: { id: true, name: true } },
                },
                orderBy: [{ createdAt: "asc" }],
              },
            },
            orderBy: [{ createdAt: "asc" }],
          },
        },
        orderBy: [{ createdAt: "asc" }],
      },
    },
  });

  if (!lead) {
    return null;
  }

  requireOrganizationAccess(user, lead.organizationId);

  if (!canManageOrganizationLeads(user.role) && lead.submittedById !== user.id) {
    return null;
  }

  const activity = await prisma.activityLog.findMany({
    where: {
      organizationId: lead.organizationId,
      entityType: "Lead",
      entityId: lead.id,
    },
    include: {
      user: { select: { id: true, name: true } },
    },
    orderBy: [{ createdAt: "asc" }],
  });

  return { user, lead, activity };
}

export async function getAdminLeadById(leadId: string) {
  const result = await getLeadById(leadId);

  if (!result) {
    return null;
  }

  requirePermission(requireAdmin(result.user), "manage_leads");

  const managers = await prisma.user.findMany({
    where: {
      organizationId: result.user.organizationId,
      role: { in: ["ORG_ADMIN", "PARTNER_MANAGER", "SUPER_ADMIN"] },
      status: "ACTIVE",
    },
    select: { id: true, name: true },
    orderBy: [{ name: "asc" }],
  });

  return { ...result, managers };
}

export async function getLeadBoardData() {
  const user = requirePermission(requireAdmin(requireActiveUser(await getCurrentUser())), "manage_leads");

  const leads = await prisma.lead.findMany({
    where: {
      ...(user.role === "SUPER_ADMIN" ? {} : { organizationId: user.organizationId }),
      status: { in: leadBoardColumns.map((column) => column.key as LeadStatus) },
      isArchived: false,
    },
    include: leadListInclude,
    orderBy: [{ lastActivityAt: "desc" }],
    take: 100,
  });

  return {
    user,
    columns: leadBoardColumns.map((column) => ({
      ...column,
      leads: leads.filter((lead) => lead.status === column.key),
    })),
  };
}

export async function getLeadDashboardData() {
  const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_dashboard");
  const where = buildLeadAccessWhere(user);

  const [activeLeadCount, recentLeads, notifications] = await Promise.all([
    prisma.lead.count({
      where: {
        ...where,
        isArchived: false,
        status: { not: "DRAFT" },
      },
    }),
    prisma.lead.findMany({
      where: {
        ...where,
        isArchived: false,
      },
      include: leadListInclude,
      orderBy: [{ lastActivityAt: "desc" }],
      take: 5,
    }),
    getCurrentUserNotifications(user.id, user.organizationId),
  ]);

  return {
    user,
    activeLeadCount,
    recentLeads: recentLeads.map((lead) => ({
      ...lead,
      progress: leadStatusProgress[lead.status],
    })),
    notifications,
  };
}

export async function getLeadDraft(leadId: string) {
  const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_own_leads");
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
  });

  if (!lead) {
    return null;
  }

  requireOrganizationAccess(user, lead.organizationId);

  if (!canManageOrganizationLeads(user.role) && lead.submittedById !== user.id) {
    return null;
  }

  return { user, lead };
}
