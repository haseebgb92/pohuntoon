import { OrganizationCard } from "@/components/admin/organization-card";
import { SettingsCard } from "@/components/admin/settings-card";
import { PageHeader } from "@/components/shared/page-header";
import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getAdminOrganizationData } from "@/lib/admin/service";

export default async function AdminOrganizationsPage() {
  const user = requirePermission(requireActiveUser(await getCurrentUser()), "manage_settings");
  const organization = await getAdminOrganizationData(user);

  return (
    <div className="space-y-6">
      <PageHeader title="Organization Management" description="Manage organization profile, logo, brand colors, contact information, and future domain controls." />
      <OrganizationCard organization={organization} />
      <div className="grid gap-4 md:grid-cols-2">
        <SettingsCard title="Branding" description="Primary color, logo, and visual identity for the installed Pohuntoon experience." />
        <SettingsCard title="Contact information" description="Organization contacts and support details for partner-facing workflows." />
        <SettingsCard title="Domains" description="Future-ready domain controls for verified organization access." />
        <SettingsCard title="Tenant safety" description="All records remain scoped by organizationId and server-side RBAC." />
      </div>
    </div>
  );
}
