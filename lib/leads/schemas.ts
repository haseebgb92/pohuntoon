import { z } from "zod";

const leadStatuses = [
  "DRAFT",
  "SUBMITTED",
  "UNDER_REVIEW",
  "MORE_INFORMATION_REQUIRED",
  "DOCUMENTS_RECEIVED",
  "APPROVED",
  "DECLINED",
  "FUNDED",
  "COMMISSION_PENDING",
  "COMMISSION_PAID",
] as const;

const leadNoteTypes = ["INTERNAL", "PARTNER"] as const;

const leadViews = ["cards", "list", "kanban"] as const;

const baseLeadFormSchema = z.object({
  company: z.string().trim().max(160).optional().default(""),
  industry: z.string().trim().max(80).optional().default(""),
  website: z
    .string()
    .trim()
    .max(200)
    .optional()
    .default("")
    .refine((value) => !value || /^https?:\/\//i.test(value), {
      message: "Website must start with http:// or https://",
    }),
  businessAgeYears: z.coerce.number().int().min(0).max(250).optional(),
  contactName: z.string().trim().max(120).optional().default(""),
  contactEmail: z.string().trim().email().max(160).optional().or(z.literal("")),
  contactPhone: z.string().trim().max(40).optional().default(""),
  requestedAmount: z.coerce.number().min(0).max(999999999999).optional(),
  fundingPurpose: z.string().trim().max(500).optional().default(""),
  notes: z.string().trim().max(4000).optional().default(""),
  revenue: z.string().trim().max(80).optional().default(""),
  employeeCount: z.coerce.number().int().min(0).max(1000000).optional(),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH"]).optional().default("MEDIUM"),
  currentStep: z.coerce.number().int().min(1).max(5).optional().default(1),
});

export const leadDraftSchema = baseLeadFormSchema.extend({
  status: z.enum(leadStatuses).optional().default("DRAFT"),
});

export const leadSubmissionSchema = baseLeadFormSchema.superRefine((value, ctx) => {
  if (!value.company || value.company.length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["company"],
      message: "Company is required.",
    });
  }

  if (!value.contactName || value.contactName.length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["contactName"],
      message: "Primary contact name is required.",
    });
  }

  if (!value.contactEmail) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["contactEmail"],
      message: "Primary contact email is required.",
    });
  }

  if (typeof value.requestedAmount !== "number") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["requestedAmount"],
      message: "Requested amount is required.",
    });
  }

  if (!value.fundingPurpose || value.fundingPurpose.length < 4) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["fundingPurpose"],
      message: "Funding purpose is required.",
    });
  }
});

export const leadFilterSchema = z.object({
  query: z.string().trim().optional().default(""),
  status: z.enum([...leadStatuses, "all"] as const).optional().default("all"),
  view: z.enum(leadViews).optional().default("cards"),
  assigned: z.enum(["all", "assigned", "unassigned"]).optional().default("all"),
  archived: z.enum(["active", "archived", "all"]).optional().default("active"),
});

export const leadStatusUpdateSchema = z.object({
  status: z.enum(leadStatuses),
  assignedManagerId: z.string().uuid().optional().nullable(),
  note: z.string().trim().max(2000).optional().default(""),
  archive: z.boolean().optional().default(false),
});

export const leadNoteSchema = z.object({
  note: z.string().trim().min(1).max(4000),
  noteType: z.enum(leadNoteTypes).optional().default("PARTNER"),
  parentNoteId: z.string().uuid().optional().nullable(),
});

export type LeadDraftInput = z.infer<typeof leadDraftSchema>;
export type LeadFilterInput = z.infer<typeof leadFilterSchema>;
export type LeadNoteInput = z.infer<typeof leadNoteSchema>;
export type LeadStatusUpdateInput = z.infer<typeof leadStatusUpdateSchema>;
export type LeadSubmissionInput = z.infer<typeof leadSubmissionSchema>;
