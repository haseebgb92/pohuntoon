import { PageHeader } from "@/components/shared/page-header";
import { ResourceUploadForm } from "@/components/resources/resource-upload-form";

export default function NewResourcePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="New resource"
        description="Upload a private organization file or register a controlled external resource link."
      />
      <ResourceUploadForm endpoint="/api/admin/resources" mode="create" />
    </div>
  );
}
