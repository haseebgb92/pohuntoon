import { ResourceCard } from "@/components/resources/resource-card";
import { ResourceFilters } from "@/components/resources/resource-filters";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { getPartnerResourceLibrary } from "@/lib/resources/queries";

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { resources, categories, fileTypes, filters } = await getPartnerResourceLibrary(
    await searchParams,
  );
  const listView = filters.view === "list";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resources"
        description="Browse the latest organization-approved collateral, templates, and reference material."
      />
      <ResourceFilters categories={categories} fileTypes={fileTypes} />
      {resources.length === 0 ? (
        <EmptyState
          title="No resources found"
          description="Try adjusting your filters or ask your organization admin to add new resources."
        />
      ) : (
        <div className={listView ? "space-y-4" : "grid gap-4 md:grid-cols-2 xl:grid-cols-3"}>
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              compact={!listView}
              detailHref={`/app/resources/${resource.id}`}
              resource={resource}
            />
          ))}
        </div>
      )}
    </div>
  );
}
