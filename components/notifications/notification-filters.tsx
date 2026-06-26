"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { NotificationCategory } from "@/lib/notifications/schemas";

const filters: Array<{ key: NotificationCategory; label: string }> = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "training", label: "Training" },
  { key: "leads", label: "Leads" },
  { key: "resources", label: "Resources" },
  { key: "community", label: "Community" },
  { key: "system", label: "System" },
];

export function NotificationFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = (searchParams.get("category") ?? "all") as NotificationCategory;
  const current = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);

  function setCategory(category: NotificationCategory) {
    const next = new URLSearchParams(current.toString());

    if (category === "all") {
      next.delete("category");
    } else {
      next.set("category", category);
    }

    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <nav aria-label="Notification filters" className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
      {filters.map((filter) => (
        <button
          aria-pressed={currentCategory === filter.key}
          className={`min-h-11 shrink-0 rounded-2xl px-4 text-sm font-medium transition motion-reduce:transition-none ${
            currentCategory === filter.key
              ? "bg-[#6E4BD8] text-white shadow-[0_10px_22px_rgba(110,75,216,0.22)]"
              : "bg-white text-muted-foreground shadow-[0_10px_24px_rgba(23,43,77,0.06)]"
          }`}
          key={filter.key}
          onClick={() => setCategory(filter.key)}
          type="button"
        >
          {filter.label}
        </button>
      ))}
    </nav>
  );
}
