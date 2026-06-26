import { SettingsLayout } from "@/components/settings/settings-layout";
import { SettingsCard } from "@/components/settings/settings-card";
import { requireActiveUser } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getUserSettingsData } from "@/lib/settings/service";

export default async function AccountPage() {
  const user = requireActiveUser(await getCurrentUser());
  const { profile } = await getUserSettingsData(user);

  return (
    <SettingsLayout title="Account" description="Manage email, password, MFA placeholder, privacy, and personal data controls.">
      <div className="grid gap-4 md:grid-cols-2">
        <SettingsCard title="Email" description={profile.email} />
        <SettingsCard title="Password" description="Password reset is handled through Supabase Auth flows." />
        <SettingsCard title="MFA" description="Future-ready multi-factor authentication controls." />
        <SettingsCard title="Download Personal Data" description="Placeholder for privacy exports and account portability." />
      </div>
    </SettingsLayout>
  );
}
