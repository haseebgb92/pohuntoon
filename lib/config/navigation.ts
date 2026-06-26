import type { AppArea, Role } from "@/lib/auth/roles";
import { adminRoles, partnerRoles } from "@/lib/auth/permissions";

export type NavigationItem = {
  href: string;
  label: string;
  area: AppArea;
  allowedRoles: Role[];
};

export const navigationItems: NavigationItem[] = [
  { href: "/app/dashboard", label: "Home", area: "partner", allowedRoles: partnerRoles },
  { href: "/app/learning", label: "Learn", area: "partner", allowedRoles: partnerRoles },
  { href: "/app/resources", label: "Resources", area: "partner", allowedRoles: partnerRoles },
  { href: "/app/leads", label: "Leads", area: "partner", allowedRoles: partnerRoles },
  { href: "/app/community", label: "Community", area: "partner", allowedRoles: partnerRoles },
  { href: "/app/notifications", label: "Notifications", area: "partner", allowedRoles: partnerRoles },
  { href: "/app/settings", label: "Settings", area: "partner", allowedRoles: partnerRoles },
  { href: "/app/profile", label: "Profile", area: "partner", allowedRoles: partnerRoles },
  { href: "/admin/dashboard", label: "Admin Dashboard", area: "admin", allowedRoles: adminRoles },
  { href: "/admin/users", label: "Users", area: "admin", allowedRoles: adminRoles },
  { href: "/admin/partners", label: "Partners", area: "admin", allowedRoles: adminRoles },
  { href: "/admin/organizations", label: "Organizations", area: "admin", allowedRoles: adminRoles },
  { href: "/admin/organization", label: "Organization", area: "admin", allowedRoles: adminRoles },
  { href: "/admin/roles", label: "Roles", area: "admin", allowedRoles: adminRoles },
  { href: "/admin/audit", label: "Audit", area: "admin", allowedRoles: adminRoles },
  { href: "/admin/integrations", label: "Integrations", area: "admin", allowedRoles: adminRoles },
  { href: "/admin/courses", label: "Courses", area: "admin", allowedRoles: adminRoles },
  { href: "/admin/resources", label: "Resources", area: "admin", allowedRoles: adminRoles },
  { href: "/admin/leads", label: "Leads", area: "admin", allowedRoles: adminRoles },
  { href: "/admin/notifications", label: "Notifications", area: "admin", allowedRoles: adminRoles },
  { href: "/admin/community", label: "Community", area: "admin", allowedRoles: adminRoles },
  { href: "/admin/settings", label: "Settings", area: "admin", allowedRoles: adminRoles },
];

export function getNavigationForArea(area: AppArea, role: Role) {
  return navigationItems.filter(
    (item) => item.area === area && item.allowedRoles.includes(role),
  );
}
