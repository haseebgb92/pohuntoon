import { notFound } from "next/navigation";

import { ResourceUploadForm } from "@/components/resources/resource-upload-form";
import { PageHeader } from "@/components/shared/page-header";
import { getAdminResourceById } from "@/lib/resources/queries";

export default async function EditResourcePage({
  params,
}: {
  params: Promise<{ resourceId: string }>;
}) {
  const { resourceId } = await params;
  const result = await getAdminResourceById(resourceId);

  if (!result) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit resource"
        description="Update metadata, replace the file, archive the resource, or remove it entirely."
      />
      <ResourceUploadForm
        endpoint={`/api/admin/resources/${result.resource.id}`}
        initialValues={{
          title: result.resource.title,
          description: result.resource.description || "",
          category: result.resource.category,
          version: result.resource.version || "",
          fileType: result.resource.fileType,
          resourceKind: result.resource.resourceKind,
          externalUrl:
            result.resource.resourceKind === "EXTERNAL_LINK" ? result.resource.fileUrl : "",
          originalFileName: result.resource.originalFileName || "",
          status: result.resource.status,
        }}
        mode="edit"
      />
    </div>
  );
}
