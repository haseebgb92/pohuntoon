import type { Prisma, ResourceStatus } from "@prisma/client";

import { requireActiveUser, requireAdmin, requireOrganizationAccess, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser, type AuthenticatedAppUser } from "@/lib/auth/get-current-user";
import { adminRoles } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db/prisma";
import { resourceFilterSchema } from "@/lib/resources/schemas";

function buildResourceVisibilityWhere(
  user: AuthenticatedAppUser,
  filters?: Partial<{
    query: string;
    category: string;
    fileType: string;
    status: ResourceStatus | "all";
  }>,
): Prisma.ResourceWhereInput {
  const where: Prisma.ResourceWhereInput = {
    organizationId: user.role === "SUPER_ADMIN" ? undefined : user.organizationId,
  };

  if (filters?.status && filters.status !== "all") {
    where.status = filters.status;
  } else {
    where.status = "ACTIVE";
  }

  if (filters?.query) {
    where.OR = [
      { title: { contains: filters.query, mode: "insensitive" } },
      { description: { contains: filters.query, mode: "insensitive" } },
      { category: { contains: filters.query, mode: "insensitive" } },
    ];
  }

  if (filters?.category && filters.category !== "all") {
    where.category = filters.category;
  }

  if (filters?.fileType && filters.fileType !== "all") {
    where.fileType = filters.fileType;
  }

  return where;
}

export async function getPartnerResourceLibrary(search: Record<string, string | undefined>) {
  const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_resources");
  const filters = resourceFilterSchema.parse(search);

  const resources = await prisma.resource.findMany({
    where: buildResourceVisibilityWhere(user, filters),
    include: {
      uploadedBy: {
        select: { name: true },
      },
    },
    orderBy: [{ updatedAt: "desc" }],
  });

  const categories = await prisma.resource.findMany({
    where: buildResourceVisibilityWhere(user, { status: "ACTIVE" }),
    select: { category: true, fileType: true },
    distinct: ["category", "fileType"],
  });

  return {
    user,
    filters,
    resources,
    categories: [...new Set(categories.map((item) => item.category))].sort(),
    fileTypes: [...new Set(categories.map((item) => item.fileType))].sort(),
  };
}

export async function getAdminResourceLibrary(search: Record<string, string | undefined>) {
  const user = requirePermission(requireAdmin(requireActiveUser(await getCurrentUser())), "manage_resources");
  const filters = resourceFilterSchema.parse(search);

  const resources = await prisma.resource.findMany({
    where: buildResourceVisibilityWhere(user, {
      ...filters,
      status: "all",
    }),
    include: {
      uploadedBy: {
        select: { name: true },
      },
      _count: {
        select: { downloads: true },
      },
    },
    orderBy: [{ updatedAt: "desc" }],
  });

  const categories = await prisma.resource.findMany({
    where: buildResourceVisibilityWhere(user, { status: "all" }),
    select: { category: true, fileType: true },
    distinct: ["category", "fileType"],
  });

  return {
    user,
    filters,
    resources,
    categories: [...new Set(categories.map((item) => item.category))].sort(),
    fileTypes: [...new Set(categories.map((item) => item.fileType))].sort(),
  };
}

export async function getResourceById(resourceId: string) {
  const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_resources");

  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
    include: {
      uploadedBy: {
        select: { id: true, name: true, email: true },
      },
      organization: {
        select: { id: true, name: true },
      },
    },
  });

  if (!resource) {
    return null;
  }

  requireOrganizationAccess(user, resource.organizationId);

  if (!adminRoles.includes(user.role) && resource.status !== "ACTIVE") {
    return null;
  }

  return {
    user,
    resource,
  };
}

export async function getAdminResourceById(resourceId: string) {
  const user = requirePermission(requireAdmin(requireActiveUser(await getCurrentUser())), "manage_resources");

  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
    include: {
      uploadedBy: {
        select: { id: true, name: true },
      },
      _count: {
        select: { downloads: true },
      },
    },
  });

  if (!resource) {
    return null;
  }

  requireOrganizationAccess(user, resource.organizationId);

  return { user, resource };
}

export async function getRelatedResources(resourceId: string, organizationId: string, category: string) {
  const result = await getCurrentUser();
  const user = requirePermission(requireActiveUser(result), "view_resources");
  requireOrganizationAccess(user, organizationId);

  return prisma.resource.findMany({
    where: {
      id: { not: resourceId },
      organizationId: user.role === "SUPER_ADMIN" ? organizationId : user.organizationId,
      category,
      status: "ACTIVE",
    },
    take: 3,
    orderBy: [{ updatedAt: "desc" }],
  });
}

export async function getResourceCategoriesForOrganization(user: AuthenticatedAppUser) {
  return prisma.resource.findMany({
    where: buildResourceVisibilityWhere(user, { status: "all" }),
    select: { category: true, fileType: true },
    distinct: ["category", "fileType"],
  });
}

export async function recordResourceDownload(resourceId: string, user: AuthenticatedAppUser) {
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
    select: { organizationId: true },
  });

  if (!resource) {
    return;
  }

  requireOrganizationAccess(user, resource.organizationId);

  await prisma.resourceDownload.create({
    data: {
      resourceId,
      userId: user.id,
      organizationId: resource.organizationId,
    },
  });
}
