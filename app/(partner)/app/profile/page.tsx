import { ProfileForm, ProfileHeader } from "@/components/settings/profile-components";
import { SettingsLayout } from "@/components/settings/settings-layout";
import { SettingsCard } from "@/components/settings/settings-card";
import { requireActiveUser } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getUserSettingsData } from "@/lib/settings/service";

export default async function ProfilePage() {
  const user = requireActiveUser(await getCurrentUser());
  const { profile, preferences } = await getUserSettingsData(user);

  return (
    <SettingsLayout title="Profile" description="Manage your personal information, avatar, contact details, preferences, and privacy.">
      <ProfileHeader profile={profile} />
      <ProfileForm profile={profile} />
      <div className="grid gap-4 md:grid-cols-2">
        <SettingsCard title="Preferences" description={`${preferences.language} • ${preferences.timezone} • ${preferences.dateFormat}`} />
        <SettingsCard title="Privacy" description={`Visibility: ${preferences.visibility}. Activity status: ${preferences.activityStatus ? "On" : "Off"}.`} />
      </div>
    </SettingsLayout>
  );
}
