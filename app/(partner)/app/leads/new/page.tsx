import { LeadWizard } from "@/components/leads/lead-wizard";
import { PageHeader } from "@/components/shared/page-header";

export default function NewLeadPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="New lead"
        description="Capture the opportunity in small steps. Drafts autosave as you move through the wizard."
      />
      <LeadWizard />
    </div>
  );
}
