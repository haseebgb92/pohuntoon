import { SettingsLayout } from "@/components/settings/settings-layout";
import { SettingsCard } from "@/components/settings/settings-card";
import { requireActiveUser } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getUserSettingsData } from "@/lib/settings/service";

export default async function AppSettingsPage() {
  const user = requireActiveUser(await getCurrentUser());
  const data = await getUserSettingsData(user);

  return (
    <SettingsLayout title="Settings" description="Manage profile, account preferences, notifications, privacy, and platform behavior from one mobile-friendly hub.">
      <div className="grid gap-4 md:grid-cols-2">
        <SettingsCard title="Profile" description={`${data.profile.name} • ${data.profile.email}`} />
        <SettingsCard title="Account" description="Email, password, and MFA placeholder for future secure account management." />
        <SettingsCard title="Preferences" description={`${data.preferences.language} • ${data.preferences.timezone} • ${data.preferences.dateFormat}`} />
        <SettingsCard title="Notifications" description="Browser push, email future-ready, community, leads, learning, and resources." />
        <SettingsCard title="Privacy" description="Visibility, activity status, and download personal data placeholder." />
        <SettingsCard title="Organization" description={`${data.organization.name} uses ${data.branding.appName} branding.`} />
      </div>
    </SettingsLayout>
  );
}
