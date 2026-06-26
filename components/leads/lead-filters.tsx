"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { leadStatusLabels } from "@/lib/leads/config";

const statusOptions = Object.entries(leadStatusLabels);

type LeadFiltersProps = {
  showAssignment?: boolean;
  showKanban?: boolean;
};

export function LeadFilters({ showAssignment = false, showKanban = true }: LeadFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);

  function updateParam(name: string, value: string) {
    const next = new URLSearchParams(current.toString());

    if (!value || value === "all" || (name === "view" && value === "cards")) {
      next.delete(name);
    } else {
      next.set(name, value);
    }

    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="grid gap-3 rounded-3xl border border-border bg-white p-4 shadow-[0_12px_32px_rgba(23,43,77,0.06)] md:grid-cols-[2fr_1fr_1fr] lg:grid-cols-[2fr_1fr_1fr_1fr]">
      <input
        className="h-11 rounded-2xl border border-input px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        defaultValue={searchParams.get("query") ?? ""}
        onBlur={(event) => updateParam("query", event.target.value)}
        placeholder="Search company, contact, email, or industry"
      />
      <select
        className="h-11 rounded-2xl border border-input px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        defaultValue={searchParams.get("status") ?? "all"}
        onChange={(event) => updateParam("status", event.target.value)}
      >
        <option value="all">All statuses</option>
        {statusOptions.map(([status, label]) => (
          <option key={status} value={status}>
            {label}
          </option>
        ))}
      </select>
      {showAssignment ? (
        <select
          className="h-11 rounded-2xl border border-input px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          defaultValue={searchParams.get("assigned") ?? "all"}
          onChange={(event) => updateParam("assigned", event.target.value)}
        >
          <option value="all">All owners</option>
          <option value="assigned">Assigned</option>
          <option value="unassigned">Unassigned</option>
        </select>
      ) : null}
      <select
        className="hidden h-11 rounded-2xl border border-input px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring lg:block"
        defaultValue={searchParams.get("view") ?? "cards"}
        onChange={(event) => updateParam("view", event.target.value)}
      >
        <option value="cards">Card view</option>
        <option value="list">List view</option>
        {showKanban ? <option value="kanban">Kanban view</option> : null}
      </select>
    </div>
  );
}
