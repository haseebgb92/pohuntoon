import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon?: LucideIcon;
};

export function StatCard({ label, value, detail, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <CardTitle className="mt-3 text-3xl font-semibold">{value}</CardTitle>
        </div>
        {Icon ? (
          <div className="rounded-lg bg-surface p-2 text-primary">
            <Icon className="size-5" />
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}
