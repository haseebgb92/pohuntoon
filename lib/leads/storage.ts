import { createAdminSupabaseClient } from "@/lib/supabase/admin";

function getLeadBucket() {
  return process.env.SUPABASE_LEAD_BUCKET || process.env.SUPABASE_RESOURCE_BUCKET || "";
}

function requireLeadBucket() {
  const value = getLeadBucket();

  if (!value) {
    throw new Error("Missing SUPABASE_LEAD_BUCKET or SUPABASE_RESOURCE_BUCKET");
  }

  return value;
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
}

export function buildLeadDocumentStoragePath(organizationId: string, leadId: string, fileName: string) {
  return `leads/${organizationId}/${leadId}/${Date.now()}-${sanitizeFileName(fileName)}`;
}

export async function uploadLeadDocument(organizationId: string, leadId: string, file: File) {
  const supabase = createAdminSupabaseClient();
  const bucket = requireLeadBucket();
  const path = buildLeadDocumentStoragePath(organizationId, leadId, file.name);

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  return path;
}

export async function deleteLeadDocument(path?: string | null) {
  if (!path || /^https?:\/\//i.test(path)) {
    return;
  }

  const supabase = createAdminSupabaseClient();
  const bucket = requireLeadBucket();
  await supabase.storage.from(bucket).remove([path]);
}

export async function createLeadDocumentDownloadUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const supabase = createAdminSupabaseClient();
  const bucket = requireLeadBucket();
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 120);

  if (error || !data?.signedUrl) {
    throw new Error(error?.message ?? "Unable to create signed download URL");
  }

  return data.signedUrl;
}
