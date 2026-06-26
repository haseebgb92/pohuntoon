"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ResourceUploadFormProps = {
  mode: "create" | "edit";
  endpoint: string;
  initialValues?: {
    title: string;
    description: string;
    category: string;
    version: string;
    fileType: string;
    resourceKind: "FILE" | "EXTERNAL_LINK";
    externalUrl: string;
    originalFileName: string;
    status?: "ACTIVE" | "ARCHIVED";
  };
};

export function ResourceUploadForm({
  mode,
  endpoint,
  initialValues,
}: ResourceUploadFormProps) {
  const router = useRouter();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resourceKind, setResourceKind] = useState<"FILE" | "EXTERNAL_LINK">(
    initialValues?.resourceKind ?? "FILE",
  );

  const title = useMemo(
    () => (mode === "create" ? "Create resource" : "Update resource"),
    [mode],
  );

  function submitForm(formData: FormData) {
    return new Promise<{ resourceId?: string; ok?: boolean }>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(mode === "create" ? "POST" : "PATCH", endpoint);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setUploadProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText || "{}"));
          return;
        }

        try {
          const parsed = JSON.parse(xhr.responseText || "{}");
          reject(new Error(parsed.error || "Unable to save resource."));
        } catch {
          reject(new Error("Unable to save resource."));
        }
      };
      xhr.onerror = () => reject(new Error("Unable to save resource."));
      xhr.send(formData);
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setUploadProgress(resourceKind === "FILE" ? 0 : 100);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await submitForm(formData);
      const message =
        mode === "create" ? "Resource created successfully." : "Resource updated successfully.";
      router.push(`/admin/resources?success=${encodeURIComponent(message)}`);
      router.refresh();
      return result;
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to save resource.",
      );
      setSubmitting(false);
      setUploadProgress(0);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this resource? This will remove it permanently.")) {
      return;
    }

    const response = await fetch(endpoint, { method: "DELETE" });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({ error: "Unable to delete resource." }));
      setError(payload.error || "Unable to delete resource.");
      return;
    }

    router.push("/admin/resources?success=Resource%20deleted%20successfully.");
    router.refresh();
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 rounded-xl border border-border bg-white p-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload a private organization resource or register a secure external link.
          </p>
        </div>
        {error ? (
          <div className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input
              className="h-10 w-full rounded-md border border-input px-3 text-sm"
              defaultValue={initialValues?.title ?? ""}
              name="title"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <input
              className="h-10 w-full rounded-md border border-input px-3 text-sm"
              defaultValue={initialValues?.category ?? ""}
              name="category"
              required
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="min-h-28 w-full rounded-md border border-input px-3 py-2 text-sm"
              defaultValue={initialValues?.description ?? ""}
              name="description"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Version</label>
            <input
              className="h-10 w-full rounded-md border border-input px-3 text-sm"
              defaultValue={initialValues?.version ?? ""}
              name="version"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Resource type</label>
            <select
              className="h-10 w-full rounded-md border border-input px-3 text-sm"
              defaultValue={initialValues?.resourceKind ?? "FILE"}
              name="resourceKind"
              onChange={(event) =>
                setResourceKind(event.target.value as "FILE" | "EXTERNAL_LINK")
              }
            >
              <option value="FILE">File upload</option>
              <option value="EXTERNAL_LINK">External link</option>
            </select>
          </div>
          {resourceKind === "FILE" ? (
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">File</label>
              <input
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.gif,.webp,.zip"
                className="block w-full rounded-md border border-input px-3 py-2 text-sm"
                name="file"
                required={mode === "create"}
                type="file"
              />
              {initialValues?.originalFileName ? (
                <p className="text-xs text-muted-foreground">
                  Current file: {initialValues.originalFileName}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">External URL</label>
              <input
                className="h-10 w-full rounded-md border border-input px-3 text-sm"
                defaultValue={initialValues?.externalUrl ?? ""}
                name="externalUrl"
                placeholder="https://docs.example.com/resource"
                type="url"
              />
            </div>
          )}
          {mode === "edit" ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                className="h-10 w-full rounded-md border border-input px-3 text-sm"
                defaultValue={initialValues?.status ?? "ACTIVE"}
                name="status"
              >
                <option value="ACTIVE">Active</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          ) : null}
        </div>
        {submitting ? (
          <div className="space-y-2">
            <div className="h-2 rounded-full bg-surface-strong">
              <div
                className="h-2 rounded-full bg-primary transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Upload progress: {uploadProgress}%
            </p>
          </div>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60"
          disabled={submitting}
          type="submit"
        >
          {mode === "create" ? "Create resource" : "Save changes"}
        </button>
        {mode === "edit" ? (
          <button
            className="inline-flex h-10 items-center rounded-md border border-destructive/20 px-4 text-sm font-medium text-destructive"
            onClick={handleDelete}
            type="button"
          >
            Delete resource
          </button>
        ) : null}
      </div>
    </form>
  );
}
