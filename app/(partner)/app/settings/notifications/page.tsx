import { NotificationSettings } from "@/components/notifications/notification-settings";
import { PageHeader } from "@/components/shared/page-header";
import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getNotificationPreferences } from "@/lib/notifications/service";

export default async function NotificationSettingsPage() {
  const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_notifications");
  const preferences = await getNotificationPreferences(user);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notification settings"
        description="Choose how Pohuntoon keeps you updated across training, leads, announcements, and browser push."
      />
      <NotificationSettings preferences={preferences} />
    </div>
  );
}
