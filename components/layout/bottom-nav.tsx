"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils/cn";
import type { NavigationItem } from "@/lib/config/navigation";

type BottomNavProps = {
  items: NavigationItem[];
};

export function BottomNav({ items }: BottomNavProps) {
  const pathname = usePathname();
  const partnerItems = items.filter((item) => item.area === "partner");

  if (partnerItems.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Partner navigation"
      className="shell-mobile-only fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 backdrop-blur supports-[padding:max(0px)]:pb-[max(env(safe-area-inset-bottom),0.75rem)]"
    >
      <ul className="mx-auto grid max-w-screen-sm grid-cols-6 gap-1 px-3 py-2">
        {partnerItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/app/dashboard" && pathname.startsWith(`${item.href}/`));

          return (
            <li key={`${item.area}-${item.href}`}>
              <Link
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-12 items-center justify-center rounded-lg px-1 text-center text-[11px] font-medium leading-tight text-muted-foreground transition-colors",
                  active && "bg-surface text-foreground",
                )}
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
