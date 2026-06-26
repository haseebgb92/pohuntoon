import Link from "next/link";

import { LeadBoard } from "@/components/leads/lead-board";
import { LeadCard } from "@/components/leads/lead-card";
import { LeadFilters } from "@/components/leads/lead-filters";
import { LeadStatusBadge } from "@/components/leads/lead-status-badge";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { leadStatusProgress } from "@/lib/leads/config";
import { formatLeadCurrency, formatLeadDate } from "@/lib/leads/format";
import { getAdminLeadLibrary } from "@/lib/leads/queries";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const { leads, filters } = await getAdminLeadLibrary(params);
  const enrichedLeads = leads.map((lead) => ({ ...lead, progress: leadStatusProgress[lead.status] }));
  const rows = enrichedLeads.map((lead) => ({
    company: (
      <div className="space-y-1">
        <p className="font-medium text-foreground">{lead.businessName || "Untitled company"}</p>
        <p className="text-xs text-muted-foreground">{lead.clientName}</p>
      </div>
    ),
    status: <LeadStatusBadge status={lead.status} />,
    amount: formatLeadCurrency(lead.requestedAmount as string | number | null),
    manager: lead.assignedManager?.name || "Unassigned",
    updated: formatLeadDate(lead.updatedAt),
    actions: <Link className="text-sm font-medium text-primary" href={`/admin/leads/${lead.id}`}>Quick view</Link>,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        actions={<Link className="inline-flex min-h-11 items-center rounded-2xl border border-border px-4 text-sm font-medium text-foreground" href="/admin/leads/board">Board view</Link>}
        title="Lead management"
        description="Review, assign, and move partner opportunities through the collaborative funding lifecycle."
      />
      <LeadFilters showAssignment />
      {enrichedLeads.length === 0 ? (
        <EmptyState title="No leads to review" description="New partner submissions will appear here with scoped organization access." />
      ) : filters.view === "kanban" ? (
        <div className="hidden lg:block">
          <LeadBoard basePath="/admin/leads" leads={enrichedLeads} />
        </div>
      ) : filters.view === "list" ? (
        <>
          <div className="hidden lg:block">
            <DataTable
              columns={[
                { key: "company", label: "Company" },
                { key: "status", label: "Status" },
                { key: "amount", label: "Requested" },
                { key: "manager", label: "Manager" },
                { key: "updated", label: "Updated" },
                { key: "actions", label: "Quick View" },
              ]}
              emptyDescription="No leads match the current filters."
              emptyTitle="No leads"
              rows={rows}
            />
          </div>
          <div className="grid gap-4 lg:hidden">
            {enrichedLeads.map((lead) => <LeadCard detailHref={`/admin/leads/${lead.id}`} key={lead.id} lead={lead} />)}
          </div>
        </>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {enrichedLeads.map((lead) => <LeadCard detailHref={`/admin/leads/${lead.id}`} key={lead.id} lead={lead} />)}
        </div>
      )}
    </div>
  );
}
