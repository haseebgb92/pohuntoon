import { AuditTimeline } from "@/components/admin/audit-timeline";
import { SettingsLayout } from "@/components/settings/settings-layout";
import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getOrganizationSettingsData } from "@/lib/settings/service";

export default async function AdminAuditPage() {
  const user = requirePermission(requireActiveUser(await getCurrentUser()), "manage_settings");
  const { auditLogs } = await getOrganizationSettingsData(user);

  return (
    <SettingsLayout title="Audit Logs" description="Read-only record of important activity including role changes, lead updates, user creation, resources, and organization updates.">
      <AuditTimeline logs={auditLogs} />
    </SettingsLayout>
  );
}
