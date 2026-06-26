import { IntegrationCard } from "@/components/settings/integration-card";
import { SettingsLayout } from "@/components/settings/settings-layout";
import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getOrganizationSettingsData } from "@/lib/settings/service";

export default async function AdminIntegrationsPage() {
  const user = requirePermission(requireActiveUser(await getCurrentUser()), "manage_settings");
  const { integrations } = await getOrganizationSettingsData(user);

  return (
    <SettingsLayout title="Integrations" description="Current Supabase and Browser Push connections plus future-ready AI, workspace, automation, and import integrations.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {integrations.map((integration) => <IntegrationCard integration={integration} key={integration.id} />)}
      </div>
    </SettingsLayout>
  );
}
