import { notFound } from "next/navigation";

import { DownloadButton } from "@/components/resources/download-button";
import { FileTypeIcon } from "@/components/resources/file-type-icon";
import { ResourceCard } from "@/components/resources/resource-card";
import { Badge } from "@/components/shared/badge";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFileTypeLabel } from "@/lib/resources/file-types";
import { getRelatedResources, getResourceById } from "@/lib/resources/queries";

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ resourceId: string }>;
}) {
  const { resourceId } = await params;
  const result = await getResourceById(resourceId);

  if (!result) {
    notFound();
  }

  const relatedResources = await getRelatedResources(
    result.resource.id,
    result.resource.organizationId,
    result.resource.category,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={result.resource.title}
        description={result.resource.description || "No description provided."}
        actions={<DownloadButton resourceId={result.resource.id} />}
      />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="rounded-lg bg-surface p-3 text-primary">
                <FileTypeIcon className="size-6" fileType={result.resource.fileType} />
              </div>
              <Badge>{getFileTypeLabel(result.resource.fileType)}</Badge>
            </div>
            <CardTitle>Resource details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm">
            <div className="grid gap-1">
              <span className="text-muted-foreground">Category</span>
              <span>{result.resource.category}</span>
            </div>
            <div className="grid gap-1">
              <span className="text-muted-foreground">Version</span>
              <span>{result.resource.version || "Current"}</span>
            </div>
            <div className="grid gap-1">
              <span className="text-muted-foreground">Uploaded by</span>
              <span>{result.resource.uploadedBy?.name || "Organization admin"}</span>
            </div>
            <div className="grid gap-1">
              <span className="text-muted-foreground">Created</span>
              <span>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(result.resource.createdAt)}</span>
            </div>
            <div className="grid gap-1">
              <span className="text-muted-foreground">Updated</span>
              <span>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(result.resource.updatedAt)}</span>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Download</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Downloads are checked against your organization access before a secure file link is issued.
              </p>
              <DownloadButton label="Download resource" resourceId={result.resource.id} />
            </CardContent>
          </Card>
          {relatedResources.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Related resources
              </h2>
              {relatedResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  detailHref={`/app/resources/${resource.id}`}
                  resource={resource}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
