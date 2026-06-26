import type { AppShellProps } from "@/components/layout/app-shell";
import { BottomNav } from "@/components/layout/bottom-nav";
import { MobilePageHeader } from "@/components/layout/mobile-page-header";

type MobileShellProps = Pick<AppShellProps, "areaLabel" | "items" | "user" | "children">;

export function MobileShell({ areaLabel, items, user, children }: MobileShellProps) {
  return (
    <div className="shell-mobile-safe-bottom min-h-dvh bg-background">
      <div className="shell-mobile-only">
        <MobilePageHeader areaLabel={areaLabel} user={user} />
      </div>
      <div>{children}</div>
      <BottomNav items={items} />
    </div>
  );
}
