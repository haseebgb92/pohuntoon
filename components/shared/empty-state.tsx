import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: ReactNode;
};

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
}: EmptyStateProps) {
  return (
    <Card className="rounded-3xl border-dashed bg-surface shadow-[0_12px_32px_rgba(23,43,77,0.06)]">
      <CardHeader className="items-start gap-3 p-6 sm:p-7">
        {Icon ? (
          <div className="rounded-2xl bg-white p-2.5 text-primary shadow-sm">
            <Icon className="size-5" />
          </div>
        ) : null}
        <div className="space-y-1">
          <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-[15px]">{description}</p>
        </div>
      </CardHeader>
      {action ? <CardContent className="px-6 pb-6 sm:px-7 sm:pb-7">{action}</CardContent> : null}
    </Card>
  );
}
