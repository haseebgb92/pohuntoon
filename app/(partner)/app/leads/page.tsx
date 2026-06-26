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
import { getPartnerLeadLibrary } from "@/lib/leads/queries";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const { leads, filters } = await getPartnerLeadLibrary(params);
  const enrichedLeads = leads.map((lead) => ({ ...lead, progress: leadStatusProgress[lead.status] }));
  const rows = enrichedLeads.map((lead) => ({
    company: lead.businessName || "Untitled company",
    status: <LeadStatusBadge status={lead.status} />,
    amount: formatLeadCurrency(lead.requestedAmount as string | number | null),
    updated: formatLeadDate(lead.updatedAt),
    progress: `${lead.progress}%`,
    actions: <Link className="text-sm font-medium text-primary" href={`/app/leads/${lead.id}`}>Quick view</Link>,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <Link className="inline-flex min-h-11 items-center rounded-2xl bg-primary px-4 text-sm font-medium text-primary-foreground" href="/app/leads/new">
            New lead
          </Link>
        }
        title="Leads"
        description="Move funding opportunities through a visual, collaborative partner workspace."
      />
      <LeadFilters />
      {enrichedLeads.length === 0 ? (
        <EmptyState
          action={<Link className="inline-flex min-h-11 items-center rounded-2xl bg-primary px-4 text-sm font-medium text-primary-foreground" href="/app/leads/new">Create your first lead</Link>}
          title="No leads yet"
          description="Start a draft and Pohuntoon will autosave progress as you collect funding details."
        />
      ) : filters.view === "kanban" ? (
        <div className="hidden lg:block">
          <LeadBoard basePath="/app/leads" leads={enrichedLeads} />
        </div>
      ) : filters.view === "list" ? (
        <>
          <div className="hidden lg:block">
            <DataTable
              columns={[
                { key: "company", label: "Company" },
                { key: "status", label: "Status" },
                { key: "amount", label: "Requested" },
                { key: "updated", label: "Updated" },
                { key: "progress", label: "Progress" },
                { key: "actions", label: "Quick View" },
              ]}
              emptyDescription="No leads match the current filters."
              emptyTitle="No leads"
              rows={rows}
            />
          </div>
          <div className="grid gap-4 lg:hidden">
            {enrichedLeads.map((lead) => <LeadCard detailHref={`/app/leads/${lead.id}`} key={lead.id} lead={lead} />)}
          </div>
        </>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {enrichedLeads.map((lead) => <LeadCard detailHref={`/app/leads/${lead.id}`} key={lead.id} lead={lead} />)}
        </div>
      )}
    </div>
  );
}
