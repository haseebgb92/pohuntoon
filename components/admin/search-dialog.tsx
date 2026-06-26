"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

type SearchResults = {
  users?: Array<{ id: string; name: string; email: string }>;
  courses?: Array<{ id: string; title: string; slug: string }>;
  resources?: Array<{ id: string; title: string; category: string }>;
  leads?: Array<{ id: string; businessName: string | null; clientName: string }>;
  posts?: Array<{ id: string; title: string }>;
};

export function SearchDialog() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({});

  async function search(value: string) {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults({});
      return;
    }

    const response = await fetch(`/api/admin/search?query=${encodeURIComponent(value)}`);
    if (response.ok) {
      setResults(await response.json());
    }
  }

  return (
    <div className="rounded-[2rem] bg-white p-4 shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
      <label className="flex min-h-12 items-center gap-3 rounded-2xl bg-surface px-3" htmlFor="admin-search">
        <Search className="size-5 text-muted-foreground" />
        <input id="admin-search" className="w-full bg-transparent text-sm outline-none" placeholder="Search users, partners, courses, resources, leads, posts..." value={query} onChange={(event) => search(event.target.value)} />
      </label>
      {query.trim().length >= 2 ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <ResultGroup title="Users" items={(results.users || []).map((item) => ({ label: item.name, href: `/admin/users?query=${item.email}` }))} />
          <ResultGroup title="Courses" items={(results.courses || []).map((item) => ({ label: item.title, href: "/admin/courses" }))} />
          <ResultGroup title="Resources" items={(results.resources || []).map((item) => ({ label: item.title, href: "/admin/resources" }))} />
          <ResultGroup title="Leads" items={(results.leads || []).map((item) => ({ label: item.businessName || item.clientName, href: `/admin/leads/${item.id}` }))} />
          <ResultGroup title="Posts" items={(results.posts || []).map((item) => ({ label: item.title, href: `/app/community/post/${item.id}` }))} />
        </div>
      ) : null}
    </div>
  );
}

function ResultGroup({ title, items }: { title: string; items: Array<{ label: string; href: string }> }) {
  return (
    <div className="rounded-2xl bg-surface p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="mt-2 space-y-2">
        {items.length === 0 ? <p className="text-xs text-muted-foreground">No matches</p> : items.map((item) => <Link className="block text-sm font-medium text-foreground" href={item.href} key={`${item.href}-${item.label}`}>{item.label}</Link>)}
      </div>
    </div>
  );
}
