import Link from "next/link";

import { Badge } from "@/components/shared/badge";
import { DownloadButton } from "@/components/resources/download-button";
import { FileTypeIcon } from "@/components/resources/file-type-icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFileTypeLabel } from "@/lib/resources/file-types";

type ResourceCardProps = {
  resource: {
    id: string;
    title: string;
    description: string | null;
    category: string;
    version: string | null;
    fileType: string;
    updatedAt: Date;
  };
  detailHref: string;
  compact?: boolean;
};

export function ResourceCard({ resource, detailHref, compact = false }: ResourceCardProps) {
  return (
    <Card className={compact ? "h-full rounded-3xl" : "rounded-3xl"}>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="rounded-2xl bg-surface p-2.5 text-primary">
            <FileTypeIcon fileType={resource.fileType} />
          </div>
          <Badge>{getFileTypeLabel(resource.fileType)}</Badge>
        </div>
        <div className="space-y-1">
          <CardTitle className="text-lg">{resource.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {resource.description || "No description provided."}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>{resource.category}</span>
          {resource.version ? <span>Version {resource.version}</span> : null}
          <span>Updated {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(resource.updatedAt)}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          <DownloadButton resourceId={resource.id} />
          <Link
            className="inline-flex min-h-11 items-center rounded-2xl border border-border px-4 text-sm font-medium text-foreground"
            href={detailHref}
          >
            View details
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
