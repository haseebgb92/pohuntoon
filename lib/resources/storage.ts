import { createAdminSupabaseClient } from "@/lib/supabase/admin";

function getResourceBucket() {
  const value = process.env.SUPABASE_RESOURCE_BUCKET;

  if (!value) {
    throw new Error("Missing SUPABASE_RESOURCE_BUCKET");
  }

  return value;
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
}

export function buildResourceStoragePath(organizationId: string, fileName: string) {
  return `resources/${organizationId}/${Date.now()}-${sanitizeFileName(fileName)}`;
}

export async function uploadResourceFile(
  organizationId: string,
  file: File,
  existingPath?: string | null,
) {
  const supabase = createAdminSupabaseClient();
  const bucket = getResourceBucket();
  const path = buildResourceStoragePath(organizationId, file.name);

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (existingPath) {
    await supabase.storage.from(bucket).remove([existingPath]);
  }

  return path;
}

export async function deleteResourceFile(path?: string | null) {
  if (!path) return;

  const supabase = createAdminSupabaseClient();
  const bucket = getResourceBucket();

  await supabase.storage.from(bucket).remove([path]);
}

export async function createResourceSignedDownloadUrl(path: string) {
  const supabase = createAdminSupabaseClient();
  const bucket = getResourceBucket();
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60);

  if (error || !data?.signedUrl) {
    throw new Error(error?.message ?? "Unable to create signed download URL");
  }

  return data.signedUrl;
}
