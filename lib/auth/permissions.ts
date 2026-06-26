import type { AuthenticatedAppUser } from "@/lib/auth/get-current-user";
import type { Role } from "@/lib/auth/roles";

export const adminRoles: Role[] = ["SUPER_ADMIN", "ORG_ADMIN", "PARTNER_MANAGER"];

export const partnerRoles: Role[] = [
  "SUPER_ADMIN",
  "ORG_ADMIN",
  "PARTNER_MANAGER",
  "PARTNER",
  "VIEWER",
];

export const permissions = [
  "view_dashboard",
  "manage_users",
  "view_learning",
  "manage_courses",
  "view_resources",
  "manage_resources",
  "submit_leads",
  "view_own_leads",
  "manage_leads",
  "view_notifications",
  "view_community",
  "manage_community",
  "manage_settings",
] as const;

export type Permission = (typeof permissions)[number];

const rolePermissions: Record<Role, Permission[]> = {
  SUPER_ADMIN: [...permissions],
  ORG_ADMIN: [...permissions],
  PARTNER_MANAGER: [
    "view_dashboard",
    "manage_users",
    "view_learning",
    "manage_courses",
    "view_resources",
    "manage_resources",
    "submit_leads",
    "view_own_leads",
    "manage_leads",
    "view_notifications",
    "view_community",
    "manage_community",
    "manage_settings",
  ],
  PARTNER: [
    "view_dashboard",
    "view_learning",
    "view_resources",
    "submit_leads",
    "view_own_leads",
    "view_notifications",
    "view_community",
  ],
  VIEWER: [
    "view_dashboard",
    "view_learning",
    "view_resources",
    "view_own_leads",
    "view_notifications",
    "view_community",
  ],
};

export function hasPermission(
  user: Pick<AuthenticatedAppUser, "role"> | null | undefined,
  permission: Permission,
) {
  if (!user) {
    return false;
  }

  return rolePermissions[user.role].includes(permission);
}
