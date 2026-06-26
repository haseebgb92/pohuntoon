import Link from "next/link";

import { ResourceCard } from "@/components/resources/resource-card";
import { ResourceFilters } from "@/components/resources/resource-filters";
import { Badge } from "@/components/shared/badge";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusToast } from "@/components/shared/status-toast";
import { getAdminResourceLibrary } from "@/lib/resources/queries";

export default async function AdminResourcesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const { resources, categories, fileTypes, filters } = await getAdminResourceLibrary(params);

  const rows = resources.map((resource) => ({
    title: (
      <div className="space-y-1">
        <p className="font-medium text-foreground">{resource.title}</p>
        <p className="text-xs text-muted-foreground">{resource.category}</p>
      </div>
    ),
    type: resource.fileType,
    version: resource.version || "Current",
    status: <Badge>{resource.status}</Badge>,
    downloads: String(resource._count.downloads),
    actions: (
      <Link className="text-sm font-medium text-primary" href={`/admin/resources/${resource.id}/edit`}>
        Edit
      </Link>
    ),
  }));

  return (
    <div className="space-y-6">
      {params.success ? <StatusToast message={params.success} tone="success" /> : null}
      <PageHeader
        title="Resources"
        description="Manage private organization resources, external links, and download-ready collateral."
        actions={
          <Link
            className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
            href="/admin/resources/new"
          >
            New resource
          </Link>
        }
      />
      <ResourceFilters categories={categories} fileTypes={fileTypes} showStatus />
      {resources.length === 0 ? (
        <EmptyState
          title="No resources available"
          description="Create your first resource to populate the organization library."
        />
      ) : (
        <>
          <div className="hidden lg:block">
            <DataTable
              columns={[
                { key: "title", label: "Title" },
                { key: "type", label: "Type" },
                { key: "version", label: "Version" },
                { key: "status", label: "Status" },
                { key: "downloads", label: "Downloads" },
                { key: "actions", label: "Actions" },
              ]}
              emptyDescription="No resources match the current filters."
              emptyTitle="No resources"
              rows={rows}
            />
          </div>
          <div className={filters.view === "list" ? "space-y-4 lg:hidden" : "grid gap-4 md:grid-cols-2 lg:hidden"}>
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                compact={filters.view !== "list"}
                detailHref={`/admin/resources/${resource.id}/edit`}
                resource={resource}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
