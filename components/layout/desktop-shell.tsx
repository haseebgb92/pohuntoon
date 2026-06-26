import type { AppShellProps } from "@/components/layout/app-shell";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function DesktopShell({ areaLabel, items, user, children }: AppShellProps) {
  return (
    <div className="shell-grid bg-background">
      <Sidebar areaLabel={areaLabel} items={items} />
      <div className="flex min-h-dvh min-w-0 flex-col">
        <div className="shell-desktop-only">
          <Topbar areaLabel={areaLabel} user={user} />
        </div>
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-4 min-[960px]:px-6 min-[960px]:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
