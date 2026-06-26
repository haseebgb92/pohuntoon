"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ResourceFiltersProps = {
  categories: string[];
  fileTypes: string[];
  showStatus?: boolean;
};

export function ResourceFilters({
  categories,
  fileTypes,
  showStatus = false,
}: ResourceFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);

  function updateParam(name: string, value: string) {
    const next = new URLSearchParams(current.toString());

    if (!value || value === "all") {
      next.delete(name);
    } else {
      next.set(name, value);
    }

    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div className="grid gap-3 rounded-xl border border-border bg-white p-4 md:grid-cols-[2fr_1fr_1fr_auto]">
      <input
        className="h-10 rounded-md border border-input px-3 text-sm"
        defaultValue={searchParams.get("query") ?? ""}
        onBlur={(event) => updateParam("query", event.target.value)}
        placeholder="Search resources"
      />
      <select
        className="h-10 rounded-md border border-input px-3 text-sm"
        defaultValue={searchParams.get("category") ?? "all"}
        onChange={(event) => updateParam("category", event.target.value)}
      >
        <option value="all">All categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <select
        className="h-10 rounded-md border border-input px-3 text-sm"
        defaultValue={searchParams.get("fileType") ?? "all"}
        onChange={(event) => updateParam("fileType", event.target.value)}
      >
        <option value="all">All file types</option>
        {fileTypes.map((fileType) => (
          <option key={fileType} value={fileType}>
            {fileType}
          </option>
        ))}
      </select>
      <select
        className="h-10 rounded-md border border-input px-3 text-sm"
        defaultValue={searchParams.get("view") ?? "grid"}
        onChange={(event) => updateParam("view", event.target.value)}
      >
        <option value="grid">Grid view</option>
        <option value="list">List view</option>
      </select>
      {showStatus ? (
        <select
          className="h-10 rounded-md border border-input px-3 text-sm md:col-span-1"
          defaultValue={searchParams.get("status") ?? "all"}
          onChange={(event) => updateParam("status", event.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      ) : null}
    </div>
  );
}
