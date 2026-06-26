import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProgressCardProps = {
  title: string;
  description: string;
  value: number;
};

export function ProgressCard({ title, description, value }: ProgressCardProps) {
  return (
    <Card className="rounded-3xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-2.5 rounded-full bg-surface-strong">
          <div
            className="h-2.5 rounded-full bg-primary"
            style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
          />
        </div>
        <p className="text-sm font-medium text-foreground">{value}% complete</p>
      </CardContent>
    </Card>
  );
}
