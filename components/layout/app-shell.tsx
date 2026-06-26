import type { ReactNode } from "react";

import { DesktopShell } from "@/components/layout/desktop-shell";
import { MobileShell } from "@/components/layout/mobile-shell";
import type { AuthenticatedAppUser } from "@/lib/auth/get-current-user";
import type { NavigationItem } from "@/lib/config/navigation";

export type AppShellProps = {
  areaLabel: string;
  items: NavigationItem[];
  user: AuthenticatedAppUser;
  children: ReactNode;
};

export function AppShell(props: AppShellProps) {
  return (
    <MobileShell areaLabel={props.areaLabel} items={props.items} user={props.user}>
      <DesktopShell {...props} />
    </MobileShell>
  );
}
