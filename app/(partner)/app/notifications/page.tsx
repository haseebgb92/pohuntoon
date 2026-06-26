import Link from "next/link";

import { ActivityFeed } from "@/components/notifications/activity-feed";
import { NotificationBadge, NotificationBell } from "@/components/notifications/notification-badge";
import { NotificationFilters } from "@/components/notifications/notification-filters";
import { NotificationList } from "@/components/notifications/notification-list";
import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getNotificationCenterData } from "@/lib/notifications/service";

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_notifications");
  const params = await searchParams;
  const { notifications, unreadCount, activity } = await getNotificationCenterData(user, params);

  return (
    <div className="space-y-6">
      <NotificationBell count={unreadCount} />
      <section className="rounded-[2.25rem] bg-gradient-to-br from-[#6E4BD8] via-[#7559DD] to-[#29B7E5] p-5 text-white shadow-[0_24px_60px_rgba(110,75,216,0.25)] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-white/80">Activity Center</p>
            <h1 className="text-3xl font-semibold tracking-tight">Notifications</h1>
            <p className="max-w-xl text-sm leading-6 text-white/80">Your live hub for lead updates, learning progress, resources, and account activity.</p>
          </div>
          <NotificationBadge count={unreadCount} />
        </div>
      </section>
      <div className="grid gap-5 lg:grid-cols-[14rem_minmax(0,1fr)_20rem]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <NotificationFilters />
        </aside>
        <NotificationList notifications={notifications} />
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
            <h2 className="text-base font-semibold text-foreground">Quick actions</h2>
            <div className="mt-4 grid gap-3">
              <Link className="min-h-11 rounded-2xl bg-[#6E4BD8] px-4 py-3 text-center text-sm font-medium text-white" href="/app/leads/new">New lead</Link>
              <Link className="min-h-11 rounded-2xl bg-surface px-4 py-3 text-center text-sm font-medium text-foreground" href="/app/settings/notifications">Notification settings</Link>
            </div>
          </div>
          <div className="rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
            <h2 className="mb-4 text-base font-semibold text-foreground">Recent activity</h2>
            <ActivityFeed activity={activity} />
          </div>
        </aside>
      </div>
    </div>
  );
}
