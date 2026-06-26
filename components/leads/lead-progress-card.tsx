import Link from "next/link";

import type { LeadStatus } from "@prisma/client";

import { LeadStatusBadge } from "@/components/leads/lead-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatLeadCurrency, formatLeadDate } from "@/lib/leads/format";

type LeadProgressCardProps = {
  title: string;
  leads: Array<{
    id: string;
    businessName: string | null;
    status: LeadStatus;
    requestedAmount: unknown;
    updatedAt: Date;
    progress: number;
  }>;
  basePath: string;
};

export function LeadProgressCard({ title, leads, basePath }: LeadProgressCardProps) {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {leads.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent leads yet.</p>
        ) : (
          leads.map((lead) => (
            <div key={lead.id} className="space-y-3 rounded-2xl border border-border bg-surface/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{lead.businessName || "Untitled company"}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatLeadCurrency(lead.requestedAmount as string | number | null)}
                  </p>
                </div>
                <LeadStatusBadge status={lead.status} />
              </div>
              <div className="space-y-2">
                <div className="h-2 rounded-full bg-surface-strong">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${lead.progress}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Updated {formatLeadDate(lead.updatedAt)}</span>
                  <span>{lead.progress}%</span>
                </div>
              </div>
              <Link className="text-sm font-medium text-primary" href={`${basePath}/${lead.id}`}>
                Quick view
              </Link>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
