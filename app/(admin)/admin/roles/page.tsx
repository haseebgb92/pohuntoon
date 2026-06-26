import { PermissionMatrix, RoleCard } from "@/components/settings/roles-components";
import { SettingsLayout } from "@/components/settings/settings-layout";
import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getRolePermissionGroups } from "@/lib/settings/service";

const roles = ["SUPER_ADMIN", "ORG_ADMIN", "PARTNER_MANAGER", "PARTNER", "VIEWER"] as const;

export default async function AdminRolesPage() {
  requirePermission(requireActiveUser(await getCurrentUser()), "manage_settings");
  const groups = getRolePermissionGroups();

  return (
    <SettingsLayout title="Roles & Permissions" description="Review current RBAC roles, permission groups, and future custom role architecture.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {roles.map((role) => <RoleCard key={role} role={role} />)}
      </div>
      <PermissionMatrix groups={groups} />
    </SettingsLayout>
  );
}
