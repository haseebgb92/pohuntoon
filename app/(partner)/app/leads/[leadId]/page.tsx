import { notFound } from "next/navigation";

import { ActivityTimeline, LeadDetailCards, LeadDocuments, LeadHeader, LeadNotes } from "@/components/leads/lead-workspace";
import { getLeadById } from "@/lib/leads/queries";

export default async function LeadDetailPage({ params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = await params;
  const result = await getLeadById(leadId);

  if (!result) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <LeadHeader lead={result.lead} />
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="space-y-6">
          <ActivityTimeline activity={result.activity} />
          <LeadNotes leadId={result.lead.id} notes={result.lead.leadNotes} />
        </div>
        <div className="space-y-6">
          <LeadDetailCards lead={result.lead} />
          <LeadDocuments documents={result.lead.documents} leadId={result.lead.id} />
        </div>
      </div>
    </div>
  );
}
