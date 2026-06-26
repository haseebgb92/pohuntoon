"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { CommunityFeedTab } from "@/lib/community/schemas";

const tabs: Array<{ key: CommunityFeedTab; label: string }> = [
  { key: "all", label: "All" },
  { key: "announcements", label: "Announcements" },
  { key: "questions", label: "Questions" },
  { key: "wins", label: "Wins" },
  { key: "training", label: "Training" },
  { key: "support", label: "Support" },
];

export function SpaceTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = (searchParams.get("tab") ?? "all") as CommunityFeedTab;
  const current = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);

  function setTab(tab: CommunityFeedTab) {
    const next = new URLSearchParams(current.toString());
    if (tab === "all") {
      next.delete("tab");
    } else {
      next.set("tab", tab);
    }
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <nav aria-label="Community feed tabs" className="flex gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => (
        <button
          aria-pressed={currentTab === tab.key}
          className={`min-h-11 shrink-0 rounded-2xl px-4 text-sm font-medium transition motion-reduce:transition-none ${
            currentTab === tab.key
              ? "bg-[#6E4BD8] text-white shadow-[0_10px_22px_rgba(110,75,216,0.22)]"
              : "bg-white text-muted-foreground shadow-[0_10px_24px_rgba(23,43,77,0.06)]"
          }`}
          key={tab.key}
          onClick={() => setTab(tab.key)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
