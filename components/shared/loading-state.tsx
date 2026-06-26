import { Card, CardContent } from "@/components/ui/card";

export function LoadingState({
  title = "Loading session",
  description = "Checking your access and organization context.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Card className="max-w-xl">
      <CardContent className="flex items-center gap-4 p-6">
        <div className="size-10 animate-pulse rounded-full bg-surface-strong" />
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
