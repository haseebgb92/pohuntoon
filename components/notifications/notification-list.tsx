import type { Notification } from "@prisma/client";

import { EmptyNotificationState, NotificationCard } from "@/components/notifications/notification-card";
import { MarkAllNotificationsButton } from "@/components/notifications/notification-actions";

export function NotificationList({ notifications }: { notifications: Notification[] }) {
  if (notifications.length === 0) {
    return <EmptyNotificationState />;
  }

  return (
    <section className="space-y-4" aria-label="Notification feed">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">Pull to refresh or swipe cards on mobile.</p>
        <MarkAllNotificationsButton />
      </div>
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
      <div className="rounded-[2rem] border border-dashed border-border bg-white/70 p-5 text-center text-sm text-muted-foreground">
        More updates load as the realtime feed expands.
      </div>
    </section>
  );
}
