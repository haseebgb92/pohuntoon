import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatLeadCurrency } from "@/lib/leads/format";
import { leadRiskLabels } from "@/lib/leads/config";

type FundingCardProps = {
  details: {
    businessName: string | null;
    industry: string | null;
    revenue: string | null;
    employeeCount: number | null;
    requestedAmount: unknown;
    fundingPurpose: string | null;
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
    businessAgeYears: number | null;
    website: string | null;
  };
};

export function FundingCard({ details }: FundingCardProps) {
  const items = [
    ["Company", details.businessName || "Not provided"],
    ["Industry", details.industry || "Not provided"],
    ["Revenue", details.revenue || "Not provided"],
    ["Employees", details.employeeCount ? String(details.employeeCount) : "Not provided"],
    ["Funding Amount", formatLeadCurrency(details.requestedAmount as string | number | null)],
    ["Funding Purpose", details.fundingPurpose || "Not provided"],
    ["Risk Level", leadRiskLabels[details.riskLevel]],
    ["Business Age", details.businessAgeYears ? `${details.businessAgeYears} years` : "Not provided"],
    ["Website", details.website || "Not provided"],
  ];

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle className="text-lg">Lead details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {items.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-border bg-surface/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
            <p className="mt-2 text-sm text-foreground">{value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
