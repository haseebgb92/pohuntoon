import { AppShell } from "@/components/layout/app-shell";
import { requireActiveUser } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getNavigationForArea } from "@/lib/config/navigation";

export default async function PartnerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = requireActiveUser(await getCurrentUser());

  return (
    <AppShell
      areaLabel="Partner workspace"
      items={getNavigationForArea("partner", user.role)}
      user={user}
    >
      {children}
    </AppShell>
  );
}
