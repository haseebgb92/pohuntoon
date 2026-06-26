import { BookOpen, Bell, FileText, Target, Zap } from "lucide-react";

import { LeadProgressCard } from "@/components/leads/lead-progress-card";
import { ActivityFeed } from "@/components/notifications/activity-feed";
import { NotificationCard } from "@/components/notifications/notification-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { ProgressCard } from "@/components/shared/progress-card";
import { StatCard } from "@/components/shared/stat-card";
import { getLeadDashboardData } from "@/lib/leads/queries";
import { getNotificationCenterData } from "@/lib/notifications/service";

export default async function PartnerDashboardPage() {
  const { activeLeadCount, recentLeads, user } = await getLeadDashboardData();
  const { notifications, unreadCount, activity } = await getNotificationCenterData(user, {});
  const latestNotification = notifications[0];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A calm starting point for partner learning, resources, and active pipeline visibility."
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Learning Progress"
          value="68%"
          detail="12 modules completed this quarter."
          icon={BookOpen}
        />
        <StatCard
          label="Resources Used"
          value="24"
          detail="Latest enablement assets reviewed this month."
          icon={FileText}
        />
        <StatCard
          label="Active Leads"
          value={String(activeLeadCount)}
          detail="Qualified partner-sourced opportunities."
          icon={Target}
        />
        <StatCard
          label="Unread Updates"
          value={String(unreadCount)}
          detail="Notifications waiting in your activity center."
          icon={Bell}
        />
      </section>
      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <LeadProgressCard basePath="/app/leads" leads={recentLeads} title="Recent leads" />
        <div className="space-y-4">
          {latestNotification ? (
            <NotificationCard notification={latestNotification} />
          ) : (
            <EmptyState
              title="No new notifications"
              description="Training, resources, and lead updates will appear here."
            />
          )}
          <ProgressCard
            title="Quick actions"
            description="Create a lead, continue learning, or open your activity center."
            value={unreadCount > 0 ? 78 : 42}
          />
        </div>
      </section>
      <section className="grid gap-4 lg:grid-cols-[1fr_0.7fr]">
        <div className="rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
            <Zap className="size-5 text-[#F5A623]" /> Recent activity
          </h2>
          <ActivityFeed activity={activity.slice(0, 4)} />
        </div>
        <EmptyState
          title="Native notification hub"
          description="Browser push, badge counts, and realtime-ready updates keep Pohuntoon feeling like an installed app."
        />
      </section>
    </>
  );
}
