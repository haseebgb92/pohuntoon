import { AuditTimeline } from "@/components/admin/audit-timeline";
import { OrganizationCard } from "@/components/admin/organization-card";
import { SettingsLayout } from "@/components/settings/settings-layout";
import { SettingsCard } from "@/components/settings/settings-card";
import { SettingsSearch } from "@/components/settings/settings-search";
import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getOrganizationSettingsData } from "@/lib/settings/service";

const sections = [
  ["General", "Core organization details and workspace defaults."],
  ["Branding", "Logo, colors, and premium mobile app presentation."],
  ["Notifications", "In-app and browser push behavior across modules."],
  ["Authentication", "Supabase Auth policies and account lifecycle controls."],
  ["Roles", "RBAC roles and permission boundaries for every module."],
  ["PWA", "Installability, push, safe areas, and offline-ready behavior."],
  ["Security", "Session safety, server validation, and organization isolation."],
  ["API Keys", "Future-ready external integration credentials."],
];

export default async function AdminSettingsPage() {
  const user = requirePermission(requireActiveUser(await getCurrentUser()), "manage_settings");
  const { organization, auditLogs } = await getOrganizationSettingsData(user);

  return (
    <SettingsLayout title="Platform Settings" description="Organization policy, white-label controls, security, PWA behavior, roles, integrations, and audit visibility.">
      <SettingsSearch />
      <OrganizationCard organization={organization} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {sections.map(([title, description]) => <SettingsCard key={title} title={title} description={description} />)}
      </div>
      <section className="rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)]">
        <h2 className="mb-4 text-base font-semibold text-foreground">Audit Logs</h2>
        <AuditTimeline logs={auditLogs} />
      </section>
    </SettingsLayout>
  );
}
