"use client";

import { useRouter } from "next/navigation";

import type { ModerationReport } from "@/lib/community/types";
import { formatLeadDateTime } from "@/lib/leads/format";

export function ModerationQueue({ reports }: { reports: ModerationReport[] }) {
  const router = useRouter();

  async function moderate(report: ModerationReport, action: "HIDE_POST" | "DELETE_POST" | "DELETE_COMMENT" | "DISMISS_REPORT" | "WARN_USER") {
    await fetch("/api/community/moderation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reportId: report.id,
        postId: report.postId,
        commentId: report.commentId,
        action,
      }),
    });
    router.refresh();
  }

  if (reports.length === 0) {
    return (
      <div className="rounded-[2rem] bg-white p-8 text-center shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
        <h2 className="text-lg font-semibold text-foreground">Moderation is clear</h2>
        <p className="mt-2 text-sm text-muted-foreground">Reported posts and comments will appear here.</p>
      </div>
    );
  }

  return (
    <section className="space-y-4" aria-label="Moderation queue">
      {reports.map((report) => (
        <article className="rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)]" key={report.id}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{report.contentType}</p>
              <h2 className="mt-1 text-base font-semibold text-foreground">{report.post?.title || "Reported comment"}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{report.comment?.body || report.post?.body}</p>
              <p className="mt-2 text-xs text-muted-foreground">Reported by {report.reporter?.name || "Unknown"} • {formatLeadDateTime(report.createdAt)}</p>
              <p className="mt-2 rounded-2xl bg-surface px-3 py-2 text-sm text-foreground">Reason: {report.reason}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {report.postId ? <button className="min-h-10 rounded-2xl bg-[#F5A623]/20 px-3 text-sm font-medium text-[#7A4C00]" onClick={() => moderate(report, "HIDE_POST")} type="button">Hide post</button> : null}
            {report.postId ? <button className="min-h-10 rounded-2xl bg-destructive px-3 text-sm font-medium text-white" onClick={() => moderate(report, "DELETE_POST")} type="button">Delete post</button> : null}
            {report.commentId ? <button className="min-h-10 rounded-2xl bg-destructive px-3 text-sm font-medium text-white" onClick={() => moderate(report, "DELETE_COMMENT")} type="button">Delete comment</button> : null}
            <button className="min-h-10 rounded-2xl bg-surface px-3 text-sm font-medium text-foreground" onClick={() => moderate(report, "DISMISS_REPORT")} type="button">Dismiss</button>
            <button className="min-h-10 rounded-2xl bg-[#6E4BD8] px-3 text-sm font-medium text-white" onClick={() => moderate(report, "WARN_USER")} type="button">Warn user</button>
          </div>
        </article>
      ))}
    </section>
  );
}
