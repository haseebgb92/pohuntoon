import { NotificationType, Prisma, type LeadStatus } from "@prisma/client";

import { requireOrganizationAccess } from "@/lib/auth/guards";
import type { AuthenticatedAppUser } from "@/lib/auth/get-current-user";
import { adminRoles } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db/prisma";
import { leadStatusLabels } from "@/lib/leads/config";
import { leadDraftSchema, leadNoteSchema, leadStatusUpdateSchema, leadSubmissionSchema, type LeadDraftInput, type LeadSubmissionInput } from "@/lib/leads/schemas";
import { uploadLeadDocument } from "@/lib/leads/storage";
import { createNotificationEvent } from "@/lib/notifications/service";

function canManageOrganizationLeads(user: AuthenticatedAppUser) {
  return adminRoles.includes(user.role);
}

async function getLeadForMutation(leadId: string) {
  return prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      submittedBy: { select: { id: true } },
    },
  });
}

type LeadDataInput = {
  businessName: string | null;
  industry: string | null;
  website: string | null;
  businessAgeYears?: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  requestedAmount?: Prisma.Decimal;
  fundingPurpose: string | null;
  notes: string | null;
  revenue: string | null;
  employeeCount?: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
};

function mapDraftInputToLeadData(input: LeadDraftInput | LeadSubmissionInput): LeadDataInput {
  return {
    businessName: input.company || null,
    industry: input.industry || null,
    website: input.website || null,
    businessAgeYears: input.businessAgeYears,
    clientName: input.contactName || "",
    clientEmail: input.contactEmail || "draft@pending.local",
    clientPhone: input.contactPhone || null,
    requestedAmount:
      typeof input.requestedAmount === "number" ? new Prisma.Decimal(input.requestedAmount) : undefined,
    fundingPurpose: input.fundingPurpose || null,
    notes: input.notes || null,
    revenue: input.revenue || null,
    employeeCount: input.employeeCount,
    riskLevel: input.riskLevel,
  };
}

async function createLeadActivity(
  leadId: string,
  organizationId: string,
  userId: string,
  action: string,
  description: string,
  metadata?: Prisma.InputJsonValue,
) {
  await prisma.activityLog.create({
    data: {
      organizationId,
      userId,
      action,
      entityType: "Lead",
      entityId: leadId,
      metadata: {
        description,
        ...(metadata && typeof metadata === "object" ? metadata : {}),
      },
    },
  });
}

async function getAdminNotificationRecipients(organizationId: string) {
  const users = await prisma.user.findMany({
    where: {
      organizationId,
      role: { in: ["SUPER_ADMIN", "ORG_ADMIN", "PARTNER_MANAGER"] },
      status: "ACTIVE",
    },
    select: { id: true, organizationId: true },
  });

  return users.map((user) => ({ userId: user.id, organizationId: user.organizationId }));
}

async function notifyLeadSubmitted(leadId: string, organizationId: string) {
  const recipients = await getAdminNotificationRecipients(organizationId);

  await createNotificationEvent({
    title: "New lead submitted",
    message: "A new partner opportunity is ready for review.",
    type: NotificationType.LEAD_UPDATE,
    linkUrl: `/admin/leads/${leadId}`,
    entityType: "Lead",
    entityId: leadId,
    recipients,
  });
}

async function notifyLeadOwner(
  leadId: string,
  organizationId: string,
  userId: string,
  title: string,
  message: string,
) {
  await createNotificationEvent({
    title,
    message,
    type: NotificationType.LEAD_UPDATE,
    linkUrl: `/app/leads/${leadId}`,
    entityType: "Lead",
    entityId: leadId,
    recipients: [{ userId, organizationId }],
  });
}

export async function createLeadDraft(user: AuthenticatedAppUser, payload: unknown) {
  const parsed = leadDraftSchema.parse(payload);
  const draft = await prisma.lead.create({
    data: {
      organizationId: user.organizationId,
      submittedById: user.id,
      status: "DRAFT",
      lastActivityAt: new Date(),
      ...mapDraftInputToLeadData(parsed),
    },
  });

  await createLeadActivity(
    draft.id,
    draft.organizationId,
    user.id,
    "lead.draft.created",
    "Draft lead created.",
  );

  return draft;
}

export async function updateLeadDraft(user: AuthenticatedAppUser, leadId: string, payload: unknown) {
  const lead = await getLeadForMutation(leadId);

  if (!lead) {
    throw new Error("Lead not found.");
  }

  requireOrganizationAccess(user, lead.organizationId);

  if (!canManageOrganizationLeads(user) && (lead.submittedById !== user.id || lead.status !== "DRAFT")) {
    throw new Error("You can only edit your own drafts.");
  }

  const parsed = leadDraftSchema.parse(payload);
  const updatedLead = await prisma.lead.update({
    where: { id: leadId },
    data: {
      ...mapDraftInputToLeadData(parsed),
      lastActivityAt: new Date(),
    },
  });

  await createLeadActivity(
    updatedLead.id,
    updatedLead.organizationId,
    user.id,
    "lead.draft.updated",
    "Draft lead updated.",
    { currentStep: parsed.currentStep },
  );

  return updatedLead;
}

export async function submitLead(user: AuthenticatedAppUser, leadId: string, payload: unknown) {
  const lead = await getLeadForMutation(leadId);

  if (!lead) {
    throw new Error("Lead not found.");
  }

  requireOrganizationAccess(user, lead.organizationId);

  if (!canManageOrganizationLeads(user) && lead.submittedById !== user.id) {
    throw new Error("You can only submit your own leads.");
  }

  const parsed = leadSubmissionSchema.parse(payload);
  const submittedLead = await prisma.lead.update({
    where: { id: leadId },
    data: {
      ...mapDraftInputToLeadData(parsed),
      status: "SUBMITTED",
      submittedAt: lead.submittedAt ?? new Date(),
      lastActivityAt: new Date(),
      clientName: parsed.contactName,
      clientEmail: parsed.contactEmail,
    },
  });

  await createLeadActivity(
    submittedLead.id,
    submittedLead.organizationId,
    user.id,
    "lead.submitted",
    "Lead submitted for review.",
  );

  await notifyLeadSubmitted(submittedLead.id, submittedLead.organizationId);

  return submittedLead;
}

export async function updateLeadStatus(user: AuthenticatedAppUser, leadId: string, payload: unknown) {
  const parsed = leadStatusUpdateSchema.parse(payload);
  const lead = await getLeadForMutation(leadId);

  if (!lead) {
    throw new Error("Lead not found.");
  }

  requireOrganizationAccess(user, lead.organizationId);

  if (!canManageOrganizationLeads(user)) {
    throw new Error("Only lead managers can update lead status.");
  }

  const data: Prisma.LeadUncheckedUpdateInput = {
    status: parsed.status,
    assignedManagerId: parsed.assignedManagerId || null,
    lastActivityAt: new Date(),
    isArchived: parsed.archive,
    archivedAt: parsed.archive ? new Date() : null,
  };

  if (parsed.status === "SUBMITTED" && !lead.submittedAt) {
    data.submittedAt = new Date();
  }

  const updatedLead = await prisma.lead.update({
    where: { id: leadId },
    data,
  });

  await createLeadActivity(
    updatedLead.id,
    updatedLead.organizationId,
    user.id,
    parsed.archive ? "lead.archived" : "lead.status.changed",
    parsed.archive
      ? "Lead archived."
      : `Lead moved to ${leadStatusLabels[parsed.status]}.`,
    { previousStatus: lead.status, nextStatus: parsed.status, note: parsed.note },
  );

  if (parsed.note) {
    await prisma.leadNote.create({
      data: {
        leadId,
        authorId: user.id,
        note: parsed.note,
        noteType: "INTERNAL",
      },
    });
  }

  if (lead.submittedById) {
    const title =
      parsed.status === "APPROVED"
        ? "Lead approved"
        : parsed.status === "FUNDED"
          ? "Lead funded"
          : "Lead status changed";
    const message =
      parsed.status === "APPROVED"
        ? "Your funding opportunity has been approved."
        : parsed.status === "FUNDED"
          ? "Your funding opportunity has been funded."
          : `Your lead is now ${leadStatusLabels[parsed.status]}.`;

    await notifyLeadOwner(updatedLead.id, updatedLead.organizationId, lead.submittedById, title, message);
  }

  return updatedLead;
}

export async function addLeadNote(
  user: AuthenticatedAppUser,
  leadId: string,
  payload: unknown,
  files: File[] = [],
) {
  const lead = await getLeadForMutation(leadId);

  if (!lead) {
    throw new Error("Lead not found.");
  }

  requireOrganizationAccess(user, lead.organizationId);

  if (!canManageOrganizationLeads(user) && lead.submittedById !== user.id) {
    throw new Error("You do not have access to this lead.");
  }

  const parsed = leadNoteSchema.parse(payload);

  if (parsed.noteType === "INTERNAL" && !canManageOrganizationLeads(user)) {
    throw new Error("Only lead managers can add internal notes.");
  }

  const note = await prisma.leadNote.create({
    data: {
      leadId,
      authorId: user.id,
      parentNoteId: parsed.parentNoteId || null,
      note: parsed.note,
      noteType: parsed.noteType,
    },
  });

  if (files.length > 0) {
    const uploads = await Promise.all(
      files.filter((file) => file.size > 0).map(async (file) => ({
        fileName: file.name,
        originalFileName: file.name,
        fileType: file.type || "application/octet-stream",
        fileSizeBytes: file.size,
        fileUrl: await uploadLeadDocument(lead.organizationId, lead.id, file),
      })),
    );

    if (uploads.length > 0) {
      await prisma.leadDocument.createMany({
        data: uploads.map((file) => ({
          leadId,
          noteId: note.id,
          uploadedById: user.id,
          ...file,
        })),
      });
    }
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      lastActivityAt: new Date(),
    },
  });

  await createLeadActivity(
    leadId,
    lead.organizationId,
    user.id,
    parsed.noteType === "INTERNAL" ? "lead.internal_note.added" : "lead.note.added",
    parsed.parentNoteId ? "Lead reply added." : "Lead note added.",
  );

  if (canManageOrganizationLeads(user)) {
    if (lead.submittedById && parsed.noteType === "PARTNER") {
      await notifyLeadOwner(
        leadId,
        lead.organizationId,
        lead.submittedById,
        "Status update from admin",
        "A new note has been added to your lead workspace.",
      );
    }
  } else {
    const recipients = await getAdminNotificationRecipients(lead.organizationId);
    await createNotificationEvent({
      title: "Partner reply received",
      message: "A partner added a new lead note.",
      type: NotificationType.LEAD_UPDATE,
      linkUrl: `/admin/leads/${leadId}`,
      entityType: "Lead",
      entityId: leadId,
      recipients,
    });
  }

  return note;
}

export async function addLeadDocuments(user: AuthenticatedAppUser, leadId: string, files: File[]) {
  const lead = await getLeadForMutation(leadId);

  if (!lead) {
    throw new Error("Lead not found.");
  }

  requireOrganizationAccess(user, lead.organizationId);

  if (!canManageOrganizationLeads(user) && lead.submittedById !== user.id) {
    throw new Error("You do not have access to this lead.");
  }

  const validFiles = files.filter((file) => file.size > 0);

  if (validFiles.length === 0) {
    throw new Error("At least one file is required.");
  }

  const uploads = await Promise.all(
    validFiles.map(async (file) => ({
      leadId,
      uploadedById: user.id,
      fileName: file.name,
      originalFileName: file.name,
      fileType: file.type || "application/octet-stream",
      fileSizeBytes: file.size,
      fileUrl: await uploadLeadDocument(lead.organizationId, lead.id, file),
    })),
  );

  await prisma.leadDocument.createMany({
    data: uploads,
  });

  const nextStatus: LeadStatus | null = canManageOrganizationLeads(user)
    ? null
    : lead.status === "MORE_INFORMATION_REQUIRED"
      ? "DOCUMENTS_RECEIVED"
      : null;

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      status: nextStatus ?? undefined,
      lastActivityAt: new Date(),
    },
  });

  await createLeadActivity(
    leadId,
    lead.organizationId,
    user.id,
    "lead.documents.uploaded",
    `${uploads.length} document${uploads.length === 1 ? "" : "s"} uploaded.`,
    { nextStatus },
  );

  if (canManageOrganizationLeads(user)) {
    if (lead.submittedById) {
      await notifyLeadOwner(
        leadId,
        lead.organizationId,
        lead.submittedById,
        "Documents added to your lead",
        "A new document has been uploaded in your lead workspace.",
      );
    }
  } else {
    const recipients = await getAdminNotificationRecipients(lead.organizationId);
    await createNotificationEvent({
      title: "Documents uploaded",
      message: "A partner uploaded documents for a lead.",
      type: NotificationType.LEAD_UPDATE,
      linkUrl: `/admin/leads/${leadId}`,
      entityType: "Lead",
      entityId: leadId,
      recipients,
    });
  }

  return uploads.length;
}

export async function markLeadExported(user: AuthenticatedAppUser, leadId: string) {
  const lead = await getLeadForMutation(leadId);

  if (!lead) {
    throw new Error("Lead not found.");
  }

  requireOrganizationAccess(user, lead.organizationId);

  if (!canManageOrganizationLeads(user)) {
    throw new Error("Only lead managers can export leads.");
  }

  await createLeadActivity(
    leadId,
    lead.organizationId,
    user.id,
    "lead.exported",
    "Lead exported.",
  );
}
