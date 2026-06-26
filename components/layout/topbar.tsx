import Link from "next/link";

import { Badge } from "@/components/shared/badge";
import { brand } from "@/lib/config/brand";
import type { AuthenticatedAppUser } from "@/lib/auth/get-current-user";
import { roleLabels } from "@/lib/auth/roles";
import { logout } from "@/app/actions/logout";

type TopbarProps = {
  user: AuthenticatedAppUser;
  areaLabel: string;
};

export function Topbar({ user, areaLabel }: TopbarProps) {
  const settingsHref =
    user.role === "SUPER_ADMIN" || user.role === "ORG_ADMIN" || user.role === "PARTNER_MANAGER"
      ? "/admin/settings"
      : "/app/profile";

  return (
    <header className="flex items-start justify-between gap-4 border-b border-border bg-background px-6 py-4">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
          {brand.name}
        </p>
        <p className="mt-1 truncate text-sm text-muted-foreground">{areaLabel}</p>
        <p className="truncate text-base font-medium text-foreground">{user.organizationName}</p>
      </div>
      <details className="relative shrink-0">
        <summary className="flex max-w-[min(100%,22rem)] cursor-pointer list-none items-center gap-3 rounded-lg border border-border bg-white px-3 py-2 text-left shadow-sm">
          <div className="min-w-0 text-right">
            <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <div className="shrink-0">
            <Badge variant="primary">{roleLabels[user.role]}</Badge>
          </div>
        </summary>
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-20 w-72 rounded-xl border border-border bg-white p-3 shadow-xl">
          <div className="border-b border-border px-2 pb-3">
            <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">{user.email}</p>
            <div className="mt-3 flex items-center justify-between">
              <Badge variant="primary">{roleLabels[user.role]}</Badge>
              <p className="truncate pl-3 text-xs text-muted-foreground">{user.organizationName}</p>
            </div>
          </div>
          <div className="flex flex-col gap-1 px-1 py-3 text-sm">
            <Link className="rounded-md px-2 py-2 hover:bg-surface" href="/app/profile">
              Profile
            </Link>
            <Link className="rounded-md px-2 py-2 hover:bg-surface" href={settingsHref}>
              Settings
            </Link>
          </div>
          <form action={logout} className="border-t border-border px-1 pt-3">
            <button
              className="w-full rounded-md px-2 py-2 text-left text-sm font-medium text-foreground hover:bg-surface"
              type="submit"
            >
              Logout
            </button>
          </form>
        </div>
      </details>
    </header>
  );
}
