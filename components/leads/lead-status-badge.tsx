import type { LeadStatus } from "@prisma/client";

import { Badge } from "@/components/shared/badge";
import { leadStatusLabels } from "@/lib/leads/config";

type LeadStatusBadgeProps = {
  status: LeadStatus;
};

function getVariant(status: LeadStatus): "default" | "primary" | "success" | "warning" {
  switch (status) {
    case "APPROVED":
    case "FUNDED":
    case "COMMISSION_PAID":
      return "success";
    case "MORE_INFORMATION_REQUIRED":
    case "COMMISSION_PENDING":
      return "warning";
    case "SUBMITTED":
    case "UNDER_REVIEW":
    case "DOCUMENTS_RECEIVED":
      return "primary";
    default:
      return "default";
  }
}

export function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  return <Badge variant={getVariant(status)}>{leadStatusLabels[status]}</Badge>;
}
