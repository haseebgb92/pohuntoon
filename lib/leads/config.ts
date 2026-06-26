import type { LeadStatus, LeadRiskLevel } from "@prisma/client";

export const leadStatusLabels: Record<LeadStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  MORE_INFORMATION_REQUIRED: "More Information Required",
  DOCUMENTS_RECEIVED: "Documents Received",
  APPROVED: "Approved",
  DECLINED: "Declined",
  FUNDED: "Funded",
  COMMISSION_PENDING: "Commission Pending",
  COMMISSION_PAID: "Commission Paid",
};

export const leadStatusProgress: Record<LeadStatus, number> = {
  DRAFT: 12,
  SUBMITTED: 24,
  UNDER_REVIEW: 42,
  MORE_INFORMATION_REQUIRED: 56,
  DOCUMENTS_RECEIVED: 68,
  APPROVED: 82,
  DECLINED: 100,
  FUNDED: 92,
  COMMISSION_PENDING: 96,
  COMMISSION_PAID: 100,
};

export const leadBoardColumns = [
  { key: "SUBMITTED", label: "Submitted" },
  { key: "UNDER_REVIEW", label: "Reviewing" },
  { key: "MORE_INFORMATION_REQUIRED", label: "Waiting" },
  { key: "APPROVED", label: "Approved" },
  { key: "FUNDED", label: "Funded" },
] as const;

export const leadBoardStatuses = leadBoardColumns.map((column) => column.key);

export const leadTimelineStatuses: LeadStatus[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "MORE_INFORMATION_REQUIRED",
  "APPROVED",
  "FUNDED",
  "COMMISSION_PAID",
];

export const leadRiskLabels: Record<LeadRiskLevel, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};
