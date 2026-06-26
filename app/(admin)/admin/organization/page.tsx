import { OrganizationSettingsForm } from "@/components/settings/organization-components";
import { SettingsLayout } from "@/components/settings/settings-layout";
import { SettingsCard } from "@/components/settings/settings-card";
import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getOrganizationSettingsData } from "@/lib/settings/service";

export default async function AdminOrganizationPage() {
  const user = requirePermission(requireActiveUser(await getCurrentUser()), "manage_settings");
  const { organization, branding } = await getOrganizationSettingsData(user);

  return (
    <SettingsLayout title="Organization" description="Configure organization profile, branding, colors, white-label assets, and future SaaS controls.">
      <OrganizationSettingsForm organization={organization} branding={branding} />
      <div className="grid gap-4 md:grid-cols-2">
        <SettingsCard title="Custom Domain" description="Future-ready verified domain and tenant routing controls." />
        <SettingsCard title="White-label Login" description="Future login screen branding and organization-specific welcome experience." />
        <SettingsCard title="Email Branding" description="Future branded transactional email templates and sender controls." />
        <SettingsCard title="Splash Screen" description="Future PWA splash and install branding architecture." />
      </div>
    </SettingsLayout>
  );
}
