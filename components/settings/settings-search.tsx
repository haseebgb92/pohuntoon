"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

type SettingsSearchResults = {
  settings?: string[];
  users?: Array<{ id: string; name: string; email: string }>;
};

const settingsLinks: Record<string, string> = {
  General: "/app/settings",
  Profile: "/app/profile",
  Organization: "/admin/organization",
  Branding: "/admin/organization#branding",
  Users: "/admin/users",
  Roles: "/admin/roles",
  Notifications: "/app/settings/notifications",
  Security: "/app/account",
  Integrations: "/admin/integrations",
  "Audit Logs": "/admin/audit",
};

export function SettingsSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SettingsSearchResults>({});

  async function search(value: string) {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults({});
      return;
    }

    const response = await fetch(`/api/settings?query=${encodeURIComponent(value)}`);
    if (response.ok) {
      setResults(await response.json());
    }
  }

  return (
    <div className="rounded-[2rem] bg-white p-4 shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
      <label className="flex min-h-12 items-center gap-3 rounded-2xl bg-surface px-3" htmlFor="settings-search">
        <Search className="size-5 text-muted-foreground" aria-hidden="true" />
        <input
          className="w-full bg-transparent text-sm outline-none"
          id="settings-search"
          onChange={(event) => search(event.target.value)}
          placeholder="Search settings, users, roles, integrations, organization, branding..."
          value={query}
        />
      </label>
      {query.trim().length >= 2 ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-surface p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Settings</p>
            <div className="mt-2 space-y-2">
              {(results.settings || []).length === 0 ? <p className="text-xs text-muted-foreground">No matches</p> : null}
              {(results.settings || []).map((item) => (
                <Link className="block text-sm font-medium text-foreground" href={settingsLinks[item] || "/app/settings"} key={item}>
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-surface p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Users</p>
            <div className="mt-2 space-y-2">
              {(results.users || []).length === 0 ? <p className="text-xs text-muted-foreground">No matches</p> : null}
              {(results.users || []).map((user) => (
                <Link className="block text-sm font-medium text-foreground" href={`/admin/users?query=${encodeURIComponent(user.email)}`} key={user.id}>
                  {user.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
