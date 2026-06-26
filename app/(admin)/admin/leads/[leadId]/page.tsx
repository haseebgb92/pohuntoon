import { notFound } from "next/navigation";

import { ActivityTimeline, LeadDetailCards, LeadDocuments, LeadHeader, LeadNotes } from "@/components/leads/lead-workspace";
import { LeadAdminActions } from "@/components/leads/lead-workspace-actions";
import { getAdminLeadById } from "@/lib/leads/queries";

export default async function AdminLeadDetailPage({ params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = await params;
  const result = await getAdminLeadById(leadId);

  if (!result) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <LeadHeader isAdmin lead={result.lead} />
      <LeadAdminActions
        currentStatus={result.lead.status}
        leadId={result.lead.id}
        managers={result.managers}
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="space-y-6">
          <ActivityTimeline activity={result.activity} />
          <LeadNotes isAdmin leadId={result.lead.id} notes={result.lead.leadNotes} />
        </div>
        <div className="space-y-6">
          <LeadDetailCards lead={result.lead} />
          <LeadDocuments documents={result.lead.documents} leadId={result.lead.id} />
        </div>
      </div>
    </div>
  );
}
