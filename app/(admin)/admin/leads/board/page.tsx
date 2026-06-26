import { LeadBoard } from "@/components/leads/lead-board";
import { PageHeader } from "@/components/shared/page-header";
import { getLeadBoardData } from "@/lib/leads/queries";

export default async function AdminLeadBoardPage() {
  const { columns } = await getLeadBoardData();
  const leads = columns.flatMap((column) => column.leads);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lead board"
        description="A visual pipeline for submitted, reviewing, waiting, approved, and funded opportunities. Desktop supports board-style workflows; mobile keeps card lists touch-friendly."
      />
      <LeadBoard basePath="/admin/leads" leads={leads} />
    </div>
  );
}
