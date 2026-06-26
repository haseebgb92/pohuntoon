"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LeadDocumentUploaderProps = {
  leadId: string;
};

export function LeadDocumentUploader({ leadId }: LeadDocumentUploaderProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const response = await fetch(`/api/leads/${leadId}/documents`, {
      method: "POST",
      body: new FormData(event.currentTarget),
    });
    const payload = await response.json().catch(() => ({ error: "Unable to upload documents." }));

    setSubmitting(false);
    if (!response.ok) {
      setMessage(payload.error || "Unable to upload documents.");
      return;
    }

    event.currentTarget.reset();
    setMessage("Documents uploaded.");
    router.refresh();
  }

  return (
    <form className="rounded-2xl border border-dashed border-border bg-surface/60 p-4" onSubmit={handleSubmit}>
      <label className="block text-sm font-medium text-foreground" htmlFor="lead-files">
        Upload documents
      </label>
      <p className="mt-1 text-xs text-muted-foreground">PDF, images, Word, Excel, and ZIP files are supported. Camera upload is available on mobile.</p>
      <input
        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.webp,.zip"
        capture="environment"
        className="mt-3 block w-full rounded-2xl border border-input bg-white px-3 py-2 text-sm"
        id="lead-files"
        multiple
        name="files"
        required
        type="file"
      />
      {message ? <p className="mt-2 text-sm text-muted-foreground">{message}</p> : null}
      <button className="mt-3 inline-flex min-h-11 items-center rounded-2xl bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60" disabled={submitting} type="submit">
        {submitting ? "Uploading..." : "Upload files"}
      </button>
    </form>
  );
}

type LeadNoteComposerProps = {
  leadId: string;
  isAdmin?: boolean;
};

export function LeadNoteComposer({ leadId, isAdmin = false }: LeadNoteComposerProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const response = await fetch(`/api/leads/${leadId}/notes`, {
      method: "POST",
      body: new FormData(event.currentTarget),
    });
    const payload = await response.json().catch(() => ({ error: "Unable to add note." }));

    setSubmitting(false);
    if (!response.ok) {
      setMessage(payload.error || "Unable to add note.");
      return;
    }

    event.currentTarget.reset();
    setMessage("Note added.");
    router.refresh();
  }

  return (
    <form className="space-y-3 rounded-2xl border border-border bg-surface/60 p-4" onSubmit={handleSubmit}>
      <textarea className="min-h-28 w-full rounded-2xl border border-input bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" name="note" placeholder="Write a quick workspace note..." required />
      <div className="flex flex-wrap items-center gap-3">
        {isAdmin ? (
          <select className="h-11 rounded-2xl border border-input bg-white px-3 text-sm" name="noteType" defaultValue="INTERNAL">
            <option value="INTERNAL">Internal note</option>
            <option value="PARTNER">Partner-visible note</option>
          </select>
        ) : (
          <input name="noteType" type="hidden" value="PARTNER" />
        )}
        <input className="block rounded-2xl border border-input bg-white px-3 py-2 text-sm" multiple name="files" type="file" />
        <button className="inline-flex min-h-11 items-center rounded-2xl bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60" disabled={submitting} type="submit">
          {submitting ? "Adding..." : "Add note"}
        </button>
      </div>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
    </form>
  );
}

type LeadAdminActionsProps = {
  leadId: string;
  managers: Array<{ id: string; name: string }>;
  currentStatus: string;
  currentManagerId?: string | null;
};

export function LeadAdminActions({ leadId, managers, currentStatus, currentManagerId }: LeadAdminActionsProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    const formData = new FormData(event.currentTarget);

    const response = await fetch(`/api/admin/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: String(formData.get("status")),
        assignedManagerId: String(formData.get("assignedManagerId") || "") || null,
        note: String(formData.get("note") || ""),
        archive: formData.get("archive") === "on",
      }),
    });
    const payload = await response.json().catch(() => ({ error: "Unable to update lead." }));

    setSubmitting(false);
    if (!response.ok) {
      setMessage(payload.error || "Unable to update lead.");
      return;
    }

    setMessage("Lead updated.");
    router.refresh();
  }

  return (
    <form className="space-y-3 rounded-3xl border border-border bg-white p-4" onSubmit={handleSubmit}>
      <h2 className="text-sm font-semibold text-foreground">Admin actions</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <select className="h-11 rounded-2xl border border-input px-3 text-sm" defaultValue={currentStatus} name="status">
          <option value="SUBMITTED">Submitted</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="MORE_INFORMATION_REQUIRED">More Information Required</option>
          <option value="DOCUMENTS_RECEIVED">Documents Received</option>
          <option value="APPROVED">Approved</option>
          <option value="DECLINED">Declined</option>
          <option value="FUNDED">Funded</option>
          <option value="COMMISSION_PENDING">Commission Pending</option>
          <option value="COMMISSION_PAID">Commission Paid</option>
        </select>
        <select className="h-11 rounded-2xl border border-input px-3 text-sm" defaultValue={currentManagerId ?? ""} name="assignedManagerId">
          <option value="">Unassigned</option>
          {managers.map((manager) => (
            <option key={manager.id} value={manager.id}>{manager.name}</option>
          ))}
        </select>
      </div>
      <textarea className="min-h-20 w-full rounded-2xl border border-input px-3 py-2 text-sm" name="note" placeholder="Optional internal note or document request" />
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input name="archive" type="checkbox" /> Archive lead
      </label>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      <div className="flex flex-wrap gap-3">
        <button className="inline-flex min-h-11 items-center rounded-2xl bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60" disabled={submitting} type="submit">
          {submitting ? "Saving..." : "Save changes"}
        </button>
        <a className="inline-flex min-h-11 items-center rounded-2xl border border-border px-4 text-sm font-medium text-foreground" href={`/api/admin/leads/${leadId}/export`}>
          Export lead
        </a>
      </div>
    </form>
  );
}
