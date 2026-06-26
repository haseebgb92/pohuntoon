import { redirect } from "next/navigation";

import type {
  AuthenticatedAppUser,
  CurrentUserResult,
} from "@/lib/auth/get-current-user";
import { adminRoles, hasPermission, partnerRoles, type Permission } from "@/lib/auth/permissions";
import type { AppArea, Role } from "@/lib/auth/roles";

export function hasRole(role: Role | null | undefined, allowedRoles: Role[]) {
  if (!role) {
    return false;
  }

  return allowedRoles.includes(role);
}

export function canAccessArea(role: Role | null | undefined, area: AppArea) {
  return area === "admin"
    ? hasRole(role, adminRoles)
    : hasRole(role, partnerRoles);
}

export function requireRole(
  user: AuthenticatedAppUser | null | undefined,
  role: Role,
): AuthenticatedAppUser {
  if (!user || user.role !== role) {
    redirect("/unauthorized");
  }

  return user;
}

export function requireAdmin(user: AuthenticatedAppUser | null | undefined): AuthenticatedAppUser {
  if (!user || !adminRoles.includes(user.role)) {
    redirect("/unauthorized");
  }

  return user;
}

export function requirePermission(
  user: AuthenticatedAppUser | null | undefined,
  permission: Permission,
): AuthenticatedAppUser {
  if (!user || !hasPermission(user, permission)) {
    redirect("/unauthorized");
  }

  return user;
}

export function requireOrganizationAccess(
  user: AuthenticatedAppUser | null | undefined,
  organizationId: string,
): AuthenticatedAppUser {
  if (!user) {
    redirect("/login");
  }

  if (user.role !== "SUPER_ADMIN" && user.organizationId !== organizationId) {
    redirect("/unauthorized");
  }

  return user;
}

export function requireActiveUser(
  result: CurrentUserResult,
  options?: { allowInvited?: boolean },
) {
  if (result.kind === "anonymous") {
    redirect("/login");
  }

  if (result.kind === "account-not-found") {
    redirect("/account-not-found");
  }

  const { user } = result;

  if (user.status === "SUSPENDED") {
    redirect("/account-suspended");
  }

  if (user.status === "INVITED" && !options?.allowInvited) {
    redirect("/invite-pending");
  }

  return user;
}
