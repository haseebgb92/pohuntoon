import Link from "next/link";

import type { LeadStatus } from "@prisma/client";

import { LeadCard } from "@/components/leads/lead-card";
import { leadBoardColumns, leadStatusProgress } from "@/lib/leads/config";

type BoardLead = {
  id: string;
  businessName: string | null;
  clientName: string;
  requestedAmount: unknown;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
  assignedManager: { name: string } | null;
};

type LeadBoardProps = {
  leads: BoardLead[];
  basePath: string;
  compact?: boolean;
};

export function LeadBoard({ leads, basePath, compact = false }: LeadBoardProps) {
  const columns = leadBoardColumns.map((column) => ({
    ...column,
    leads: leads.filter((lead) => lead.status === column.key),
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {columns.map((column) => (
        <section
          aria-label={`${column.label} leads`}
          className="rounded-3xl border border-border bg-white/80 p-3 shadow-[0_12px_32px_rgba(23,43,77,0.06)]"
          key={column.key}
        >
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold text-foreground">{column.label}</h2>
            <span className="rounded-full bg-surface-strong px-2 py-1 text-xs text-muted-foreground">
              {column.leads.length}
            </span>
          </div>
          <div className="space-y-3">
            {column.leads.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-surface/60 p-4 text-sm text-muted-foreground">
                No leads here yet.
              </div>
            ) : (
              column.leads.map((lead) => (
                <LeadCard
                  compact={compact}
                  detailHref={`${basePath}/${lead.id}`}
                  key={lead.id}
                  lead={{ ...lead, progress: leadStatusProgress[lead.status] }}
                />
              ))
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

export function LeadBoardLink() {
  return (
    <Link className="inline-flex min-h-11 items-center rounded-2xl border border-border px-4 text-sm font-medium text-foreground" href="/admin/leads/board">
      Board view
    </Link>
  );
}
