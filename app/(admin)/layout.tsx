import { AppShell } from "@/components/layout/app-shell";
import { requireActiveUser, requireAdmin } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getNavigationForArea } from "@/lib/config/navigation";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = requireAdmin(requireActiveUser(await getCurrentUser()));

  return (
    <AppShell
      areaLabel="Admin workspace"
      items={getNavigationForArea("admin", user.role)}
      user={user}
    >
      {children}
    </AppShell>
  );
}
