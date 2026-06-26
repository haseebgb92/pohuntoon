import Link from "next/link";

import type { LeadStatus } from "@prisma/client";

import { LeadStatusBadge } from "@/components/leads/lead-status-badge";
import { ProgressCard } from "@/components/shared/progress-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatLeadCurrency, formatLeadDate } from "@/lib/leads/format";

type LeadCardProps = {
  lead: {
    id: string;
    businessName: string | null;
    clientName: string;
    requestedAmount: unknown;
    status: LeadStatus;
    createdAt: Date;
    updatedAt: Date;
    assignedManager: { name: string } | null;
    progress?: number;
  };
  detailHref: string;
  compact?: boolean;
};

export function LeadCard({ lead, detailHref, compact = false }: LeadCardProps) {
  const progress = lead.progress ?? 0;

  return (
    <Card className={compact ? "rounded-3xl" : "rounded-3xl"}>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-lg">{lead.businessName || "Untitled company"}</CardTitle>
            <p className="text-sm text-muted-foreground">{lead.clientName}</p>
          </div>
          <LeadStatusBadge status={lead.status} />
        </div>
        <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <p>Funding {formatLeadCurrency(lead.requestedAmount as string | number | null)}</p>
          <p>Submitted {formatLeadDate(lead.createdAt)}</p>
          <p>Manager {lead.assignedManager?.name || "Unassigned"}</p>
          <p>Updated {formatLeadDate(lead.updatedAt)}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProgressCard
          title="Progress"
          description="Track how far this opportunity has moved through review."
          value={progress}
        />
        <div className="flex flex-wrap gap-3">
          <Link
            className="inline-flex min-h-11 items-center rounded-2xl bg-primary px-4 text-sm font-medium text-primary-foreground"
            href={detailHref}
          >
            Quick view
          </Link>
          <Link
            className="inline-flex min-h-11 items-center rounded-2xl border border-border px-4 text-sm font-medium text-foreground"
            href={detailHref}
          >
            Open workspace
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
