import Link from "next/link";
import { Bell, BookOpen, FileText, MessageCircle, Target, UsersRound, Zap, Activity } from "lucide-react";

import { AdminDashboardCards } from "@/components/admin/admin-dashboard-cards";
import { AuditTimeline } from "@/components/admin/audit-timeline";
import { SearchDialog } from "@/components/admin/search-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { requireActiveUser, requireAdmin } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getAdminDashboardData } from "@/lib/admin/service";
import { formatLeadCurrency, formatLeadDateTime } from "@/lib/leads/format";

export default async function AdminDashboardPage() {
  const user = requireAdmin(requireActiveUser(await getCurrentUser()));
  const data = await getAdminDashboardData(user);

  const cards = [
    { label: "Total Partners", value: data.metrics.totalPartners, detail: "Partner accounts in this organization.", icon: UsersRound, tone: "bg-[#6E4BD8]/10 text-[#6E4BD8]" },
    { label: "Active Users", value: data.metrics.activeUsers, detail: "Users currently active and eligible.", icon: UsersRound, tone: "bg-[#29B7E5]/12 text-[#1E4E9A]" },
    { label: "Courses", value: data.metrics.courses, detail: "Learning programs available.", icon: BookOpen, tone: "bg-[#2CBF6D]/12 text-[#167A45]" },
    { label: "Resources", value: data.metrics.resources, detail: "Enablement assets in the library.", icon: FileText, tone: "bg-[#F5A623]/20 text-[#7A4C00]" },
    { label: "Leads", value: data.metrics.leads, detail: "Active funding opportunities.", icon: Target, tone: "bg-[#6E4BD8]/10 text-[#6E4BD8]" },
    { label: "Community Posts", value: data.metrics.communityPosts, detail: "Ideas, wins, and questions shared.", icon: MessageCircle, tone: "bg-[#29B7E5]/12 text-[#1E4E9A]" },
    { label: "Notifications Sent", value: data.metrics.notificationsSent, detail: "In-app updates delivered.", icon: Bell, tone: "bg-[#2CBF6D]/12 text-[#167A45]" },
    { label: "Today's Activity", value: data.metrics.todaysActivity, detail: "Audit events recorded today.", icon: Activity, tone: "bg-[#F5A623]/20 text-[#7A4C00]" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Control Center" description="A lightweight operating hub for users, partners, content, leads, community, and audit visibility." />
      <SearchDialog />
      <AdminDashboardCards cards={cards} />
      <section className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <div className="space-y-4 rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
          <h2 className="text-base font-semibold text-foreground">Latest Leads</h2>
          {data.latestLeads.length === 0 ? <EmptyState title="No leads yet" description="Lead activity will appear here." /> : data.latestLeads.map((lead) => (
            <Link className="block rounded-2xl bg-surface p-4" href={`/admin/leads/${lead.id}`} key={lead.id}>
              <div className="flex items-center justify-between gap-3">
                <div><p className="font-medium text-foreground">{lead.businessName || lead.clientName}</p><p className="mt-1 text-xs text-muted-foreground">{lead.status} • {formatLeadDateTime(lead.updatedAt)}</p></div>
                <span className="text-sm font-semibold text-[#6E4BD8]">{formatLeadCurrency(lead.requestedAmount as string | number | null)}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="space-y-4 rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
          <h2 className="text-base font-semibold text-foreground">Latest Community Posts</h2>
          {data.latestCommunityPosts.length === 0 ? <EmptyState title="No posts yet" description="Community activity will appear here." /> : data.latestCommunityPosts.map((post) => (
            <Link className="block rounded-2xl bg-surface p-4" href={`/app/community/post/${post.id}`} key={post.id}>
              <p className="font-medium text-foreground">{post.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{post.space.name} • {post.author?.name || "Unknown"}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
          <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground"><Zap className="size-5 text-[#F5A623]" /> Recent Activity</h2>
          <AuditTimeline logs={data.recentActivity} />
        </div>
        <div className="space-y-3 rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
          <h2 className="text-base font-semibold text-foreground">Pending Tasks</h2>
          {data.pendingTasks.length === 0 ? <p className="text-sm text-muted-foreground">No moderation tasks pending.</p> : data.pendingTasks.map((task) => (
            <Link className="block rounded-2xl bg-surface p-4 text-sm font-medium text-foreground" href="/admin/community/moderation" key={task.id}>{task.reason}</Link>
          ))}
          <div className="grid gap-2 pt-2">
            <Link className="min-h-11 rounded-2xl bg-[#6E4BD8] px-4 py-3 text-center text-sm font-semibold text-white" href="/admin/users">Invite user</Link>
            <Link className="min-h-11 rounded-2xl bg-surface px-4 py-3 text-center text-sm font-semibold text-foreground" href="/admin/resources/new">Add resource</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
