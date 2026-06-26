"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { brand } from "@/lib/config/brand";
import type { NavigationItem } from "@/lib/config/navigation";
import { cn } from "@/lib/utils/cn";

type SidebarProps = {
  areaLabel: string;
  items: NavigationItem[];
};

export function Sidebar({ areaLabel, items }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="shell-desktop-sidebar border-r border-border bg-surface">
      <div className="border-b border-border px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
          {brand.name}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{areaLabel}</p>
      </div>
      <nav className="flex-1 px-4 py-5">
        <ul className="space-y-1">
          {items.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));

            return (
              <li key={`${item.area}-${item.href}`}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-white hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
