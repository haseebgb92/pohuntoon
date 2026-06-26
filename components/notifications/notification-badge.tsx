import { Bell } from "lucide-react";

export function NotificationBadge({ count }: { count: number }) {
  return (
    <div className="relative inline-flex size-12 items-center justify-center rounded-2xl bg-white text-[#6E4BD8] shadow-[0_14px_30px_rgba(23,43,77,0.12)]">
      <Bell className="size-5" aria-hidden="true" />
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 min-w-6 rounded-full bg-[#F5A623] px-1.5 py-0.5 text-center text-xs font-bold text-[#172B4D]">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </div>
  );
}

export function NotificationBell({ count }: { count: number }) {
  return (
    <div className="fixed right-4 top-[calc(env(safe-area-inset-top)+5.25rem)] z-30 lg:hidden">
      <NotificationBadge count={count} />
    </div>
  );
}
