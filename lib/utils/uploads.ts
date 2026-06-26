const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

const allowedTypes = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "text/csv",
]);

export function validateUploadFile(file: File, options?: { maxBytes?: number; allowedMimeTypes?: Set<string> }) {
  const maxBytes = options?.maxBytes ?? MAX_UPLOAD_BYTES;
  const allowedMimeTypes = options?.allowedMimeTypes ?? allowedTypes;

  if (file.size <= 0) {
    throw new Error("Uploaded file is empty.");
  }

  if (file.size > maxBytes) {
    throw new Error("Uploaded file is too large.");
  }

  if (file.type && !allowedMimeTypes.has(file.type)) {
    throw new Error("Uploaded file type is not supported.");
  }

  return true;
}

export function validateUploadFiles(files: File[]) {
  files.forEach((file) => validateUploadFile(file));
}
