import type { ActivityLog } from "@prisma/client";

import { formatLeadDateTime } from "@/lib/leads/format";

type AuditTimelineProps = {
  logs: Array<ActivityLog & { user: { id: string; name: string } | null }>;
};

function description(log: ActivityLog) {
  if (log.metadata && typeof log.metadata === "object" && "description" in log.metadata) {
    const value = (log.metadata as { description?: unknown }).description;
    if (typeof value === "string") {
      return value;
    }
  }

  return log.action.replaceAll(".", " ");
}

export function AuditTimeline({ logs }: AuditTimelineProps) {
  if (logs.length === 0) {
    return <div className="rounded-[2rem] bg-white p-6 text-sm text-muted-foreground shadow-[0_18px_45px_rgba(23,43,77,0.08)]">No audit events yet.</div>;
  }

  return (
    <section className="space-y-3" aria-label="Audit log">
      {logs.map((log) => (
        <article className="rounded-[2rem] bg-white p-4 shadow-[0_12px_28px_rgba(23,43,77,0.07)]" key={log.id}>
          <p className="text-sm font-semibold text-foreground">{description(log)}</p>
          <p className="mt-1 text-xs text-muted-foreground">{log.user?.name || "System"} • {log.entityType} • {formatLeadDateTime(log.createdAt)}</p>
        </article>
      ))}
    </section>
  );
}
