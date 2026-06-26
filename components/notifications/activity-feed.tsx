import type { ActivityLog } from "@prisma/client";
import { Award, CircleDot, FileText, GraduationCap, Target, UserCog } from "lucide-react";

import { formatLeadDateTime } from "@/lib/leads/format";

type ActivityWithUser = ActivityLog & {
  user: { id: string; name: string } | null;
};

function getActivityIcon(action: string) {
  if (action.includes("lead")) {
    return Target;
  }

  if (action.includes("resource")) {
    return FileText;
  }

  if (action.includes("lesson") || action.includes("course")) {
    return GraduationCap;
  }

  if (action.includes("certificate") || action.includes("achievement")) {
    return Award;
  }

  if (action.includes("account") || action.includes("user")) {
    return UserCog;
  }

  return CircleDot;
}

function getDescription(activity: ActivityLog) {
  if (activity.metadata && typeof activity.metadata === "object" && "description" in activity.metadata) {
    const description = (activity.metadata as { description?: unknown }).description;
    if (typeof description === "string") {
      return description;
    }
  }

  return activity.action.replaceAll(".", " ");
}

export function ActivityCard({ activity }: { activity: ActivityWithUser }) {
  const Icon = getActivityIcon(activity.action);

  return (
    <article className="flex gap-3 rounded-3xl bg-white p-4 shadow-[0_12px_28px_rgba(23,43,77,0.07)]">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#29B7E5]/12 text-[#1E4E9A]">
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{getDescription(activity)}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {activity.user?.name || "System"} • {formatLeadDateTime(activity.createdAt)}
        </p>
      </div>
    </article>
  );
}

export function ActivityFeed({ activity }: { activity: ActivityWithUser[] }) {
  return (
    <section className="space-y-3" aria-label="Recent activity">
      {activity.length === 0 ? (
        <div className="rounded-3xl bg-white p-5 text-sm text-muted-foreground shadow-[0_12px_28px_rgba(23,43,77,0.07)]">
          No activity yet.
        </div>
      ) : (
        activity.map((item) => <ActivityCard activity={item} key={item.id} />)
      )}
    </section>
  );
}
