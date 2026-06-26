export const roles = [
  "SUPER_ADMIN",
  "ORG_ADMIN",
  "PARTNER_MANAGER",
  "PARTNER",
  "VIEWER",
] as const;

export type Role = (typeof roles)[number];

export type AppArea = "partner" | "admin";

export const userStatusLabels = {
  ACTIVE: "Active",
  INVITED: "Invited",
  SUSPENDED: "Suspended",
} as const;

export const roleLabels: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ORG_ADMIN: "Org Admin",
  PARTNER_MANAGER: "Partner Manager",
  PARTNER: "Partner",
  VIEWER: "Viewer",
};
