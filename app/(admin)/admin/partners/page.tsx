import { PartnerCard } from "@/components/admin/partner-card";
import { PageHeader } from "@/components/shared/page-header";
import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getAdminPartners } from "@/lib/admin/service";

export default async function AdminPartnersPage() {
  const user = requirePermission(requireActiveUser(await getCurrentUser()), "manage_users");
  const partners = await getAdminPartners(user);

  return (
    <div className="space-y-6">
      <PageHeader title="Partner Management" description="Track partner progress, leads, training engagement, login activity, and lifecycle actions." />
      <div className="grid gap-4 lg:grid-cols-2">
        {partners.map((partner) => <PartnerCard key={partner.id} partner={partner} />)}
      </div>
    </div>
  );
}
