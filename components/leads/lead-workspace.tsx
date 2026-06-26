import Link from "next/link";

import type { LeadRiskLevel, LeadStatus } from "@prisma/client";
import { FileText, MessageCircle, Upload } from "lucide-react";

import { LeadDocumentUploader, LeadNoteComposer } from "@/components/leads/lead-workspace-actions";
import { LeadStatusBadge } from "@/components/leads/lead-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { leadRiskLabels } from "@/lib/leads/config";
import { formatLeadCurrency, formatLeadDate, formatLeadDateTime } from "@/lib/leads/format";

type LeadHeaderProps = {
  lead: {
    id: string;
    businessName: string | null;
    clientName: string;
    clientEmail: string;
    clientPhone: string | null;
    status: LeadStatus;
    updatedAt: Date;
  };
  isAdmin?: boolean;
};

export function LeadHeader({ lead, isAdmin = false }: LeadHeaderProps) {
  return (
    <div className="rounded-3xl border border-border bg-gradient-to-br from-white to-[#F8F9FC] p-5 shadow-[0_18px_45px_rgba(23,43,77,0.08)] sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <LeadStatusBadge status={lead.status} />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {lead.businessName || "Untitled company"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {lead.clientName} • {lead.clientEmail}{lead.clientPhone ? ` • ${lead.clientPhone}` : ""}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Last updated {formatLeadDateTime(lead.updatedAt)}</p>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[28rem]">
          <a className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-medium text-primary-foreground" href="#documents">
            <Upload className="size-4" /> Upload
          </a>
          <a className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 text-sm font-medium text-foreground" href="#notes">
            <MessageCircle className="size-4" /> Add note
          </a>
          <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-border bg-white px-4 text-sm font-medium text-foreground" href={isAdmin ? "/admin/leads" : "/app/notifications"}>
            <FileText className="size-4" /> {isAdmin ? "All leads" : "Contact admin"}
          </Link>
        </div>
      </div>
    </div>
  );
}

type LeadDetailCardsProps = {
  lead: {
    businessName: string | null;
    industry: string | null;
    revenue: string | null;
    employeeCount: number | null;
    requestedAmount: unknown;
    fundingPurpose: string | null;
    riskLevel: LeadRiskLevel;
    businessAgeYears: number | null;
    notes: string | null;
  };
};

export function LeadDetailCards({ lead }: LeadDetailCardsProps) {
  const details = [
    ["Company", lead.businessName || "Not provided"],
    ["Industry", lead.industry || "Not provided"],
    ["Revenue", lead.revenue || "Not provided"],
    ["Employees", lead.employeeCount?.toLocaleString() || "Not provided"],
    ["Funding amount", formatLeadCurrency(lead.requestedAmount as string | number | null)],
    ["Funding purpose", lead.fundingPurpose || "Not provided"],
    ["Risk level", leadRiskLabels[lead.riskLevel]],
    ["Business age", lead.businessAgeYears === null ? "Not provided" : `${lead.businessAgeYears} years`],
  ];

  return (
    <Card className="rounded-3xl" id="details">
      <CardHeader>
        <CardTitle>Lead details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {details.map(([label, value]) => (
            <div className="rounded-2xl border border-border bg-surface/60 p-4" key={label}>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
            </div>
          ))}
        </div>
        {lead.notes ? (
          <div className="rounded-2xl border border-border bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Partner notes</p>
            <p className="mt-2 text-sm leading-6 text-foreground">{lead.notes}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

type ActivityTimelineProps = {
  activity: Array<{
    id: string;
    action: string;
    createdAt: Date;
    user: { name: string } | null;
    metadata: unknown;
  }>;
};

function getActivityDescription(metadata: unknown, fallback: string) {
  if (metadata && typeof metadata === "object" && "description" in metadata) {
    const description = (metadata as { description?: unknown }).description;
    if (typeof description === "string") {
      return description;
    }
  }

  return fallback.replaceAll(".", " ");
}

export function ActivityTimeline({ activity }: ActivityTimelineProps) {
  return (
    <Card className="rounded-3xl" id="timeline">
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {activity.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity has been recorded yet.</p>
        ) : (
          <div className="space-y-4">
            {activity.map((event) => (
              <div className="relative pl-7" key={event.id}>
                <span className="absolute left-0 top-1.5 size-3 rounded-full bg-primary" />
                <span className="absolute bottom-[-1rem] left-[5px] top-5 w-px bg-border" />
                <p className="text-sm font-medium text-foreground">
                  {getActivityDescription(event.metadata, event.action)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {event.user?.name || "System"} • {formatLeadDateTime(event.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type LeadDocumentsProps = {
  leadId: string;
  documents: Array<{
    id: string;
    fileName: string;
    originalFileName: string | null;
    fileType: string;
    createdAt: Date;
    uploadedBy: { name: string } | null;
  }>;
};

export function LeadDocuments({ leadId, documents }: LeadDocumentsProps) {
  return (
    <Card className="rounded-3xl" id="documents">
      <CardHeader>
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <LeadDocumentUploader leadId={leadId} />
        {documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {documents.map((document) => (
              <div className="rounded-2xl border border-border bg-white p-4" key={document.id}>
                <p className="font-medium text-foreground">{document.originalFileName || document.fileName}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {document.fileType} • {document.uploadedBy?.name || "Unknown"} • {formatLeadDate(document.createdAt)}
                </p>
                <div className="mt-3 flex gap-3">
                  <a className="text-sm font-medium text-primary" href={`/api/leads/documents/${document.id}/download`} target="_blank">
                    Preview
                  </a>
                  <a className="text-sm font-medium text-primary" download href={`/api/leads/documents/${document.id}/download`}>
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type LeadNotesProps = {
  leadId: string;
  notes: Array<{
    id: string;
    note: string;
    noteType: "INTERNAL" | "PARTNER";
    createdAt: Date;
    author: { name: string; email: string } | null;
    replies: Array<{
      id: string;
      note: string;
      noteType: "INTERNAL" | "PARTNER";
      createdAt: Date;
      author: { name: string; email: string } | null;
    }>;
  }>;
  isAdmin?: boolean;
};

export function LeadNotes({ leadId, notes, isAdmin = false }: LeadNotesProps) {
  return (
    <Card className="rounded-3xl" id="notes">
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <LeadNoteComposer isAdmin={isAdmin} leadId={leadId} />
        {notes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No conversation yet.</p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div className="rounded-3xl border border-border bg-white p-4" key={note.id}>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{note.author?.name || "Unknown"}</span>
                  <span>{formatLeadDateTime(note.createdAt)}</span>
                  <span className="rounded-full bg-surface-strong px-2 py-1">{note.noteType === "INTERNAL" ? "Internal" : "Partner"}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-foreground">{note.note}</p>
                {note.replies.length > 0 ? (
                  <div className="mt-4 space-y-3 border-l border-border pl-4">
                    {note.replies.map((reply) => (
                      <div key={reply.id}>
                        <p className="text-xs text-muted-foreground">
                          {reply.author?.name || "Unknown"} • {formatLeadDateTime(reply.createdAt)}
                        </p>
                        <p className="mt-1 text-sm text-foreground">{reply.note}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
