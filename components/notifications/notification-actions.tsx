"use client";

import { useRouter } from "next/navigation";

export function MarkAllNotificationsButton() {
  const router = useRouter();

  async function markAllRead() {
    await fetch("/api/notifications/mark-all-read", { method: "POST" });
    router.refresh();
  }

  return (
    <button className="min-h-10 rounded-2xl bg-white px-4 text-sm font-medium text-[#6E4BD8] shadow-[0_10px_24px_rgba(23,43,77,0.06)]" onClick={markAllRead} type="button">
      Mark all read
    </button>
  );
}

export function NotificationCardActions({ notificationId }: { notificationId: string }) {
  const router = useRouter();

  async function update(method: "PATCH" | "DELETE") {
    await fetch(`/api/notifications/${notificationId}`, {
      method,
      headers: method === "PATCH" ? { "Content-Type": "application/json" } : undefined,
      body: method === "PATCH" ? JSON.stringify({ read: true }) : undefined,
    });
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button className="rounded-2xl bg-surface px-3 py-2 text-xs font-medium text-[#6E4BD8]" onClick={() => update("PATCH")} type="button">
        Read
      </button>
      <button className="rounded-2xl bg-surface px-3 py-2 text-xs font-medium text-destructive" onClick={() => update("DELETE")} type="button">
        Delete
      </button>
    </div>
  );
}
