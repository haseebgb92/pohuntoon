"use client";

import { useRouter } from "next/navigation";
import { Bookmark, Flag } from "lucide-react";

export function SavedButton({ postId, saved }: { postId: string; saved: boolean }) {
  const router = useRouter();

  async function toggleSave() {
    await fetch(`/api/community/posts/${postId}/save`, { method: "POST" });
    router.refresh();
  }

  return (
    <button className="inline-flex min-h-10 items-center gap-2 rounded-2xl bg-surface px-3 text-sm font-medium text-foreground" onClick={toggleSave} type="button">
      <Bookmark className={`size-4 ${saved ? "fill-[#6E4BD8] text-[#6E4BD8]" : ""}`} aria-hidden="true" />
      {saved ? "Saved" : "Save"}
    </button>
  );
}

export function ReportButton({ postId }: { postId: string }) {
  const router = useRouter();

  async function report() {
    await fetch("/api/community/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentType: "POST", postId, reason: "Reported from post card" }),
    });
    router.refresh();
  }

  return (
    <button className="inline-flex min-h-10 items-center gap-2 rounded-2xl bg-surface px-3 text-sm font-medium text-muted-foreground" onClick={report} type="button">
      <Flag className="size-4" aria-hidden="true" /> Report
    </button>
  );
}
