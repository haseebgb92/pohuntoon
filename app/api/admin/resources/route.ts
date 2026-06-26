import { NextResponse } from "next/server";

import { requireActiveUser, requireAdmin, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/db/prisma";
import { resourceCreateSchema } from "@/lib/resources/schemas";
import { uploadResourceFile } from "@/lib/resources/storage";
import { validateUploadFile } from "@/lib/utils/uploads";

export async function POST(request: Request) {
  try {
    const user = requirePermission(
      requireAdmin(requireActiveUser(await getCurrentUser())),
      "manage_resources",
    );

    const formData = await request.formData();
    const file = formData.get("file");
    const resourceKind = String(formData.get("resourceKind") ?? "FILE");
    const fileUrl =
      resourceKind === "EXTERNAL_LINK" ? String(formData.get("externalUrl") ?? "") : "";

    let storedPath = fileUrl;
    let fileType = String(formData.get("fileType") ?? "");
    let originalFileName = String(formData.get("originalFileName") ?? "");

    if (resourceKind === "FILE") {
      if (!(file instanceof File) || file.size === 0) {
        return NextResponse.json({ error: "A file is required." }, { status: 400 });
      }

      validateUploadFile(file);
      storedPath = await uploadResourceFile(user.organizationId, file);
      fileType = file.type || fileType || "application/octet-stream";
      originalFileName = file.name;
    } else {
      fileType = "external-link";
      originalFileName = "";
    }

    const parsed = resourceCreateSchema.parse({
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      category: String(formData.get("category") ?? ""),
      version: String(formData.get("version") ?? ""),
      resourceKind,
      fileUrl: resourceKind === "FILE" ? storedPath : fileUrl,
      externalUrl: String(formData.get("externalUrl") ?? ""),
      fileType,
      originalFileName,
    });

    const resource = await prisma.resource.create({
      data: {
        organizationId: user.organizationId,
        title: parsed.title,
        description: parsed.description,
        category: parsed.category,
        version: parsed.version,
        fileType: parsed.fileType,
        fileUrl: parsed.fileUrl,
        originalFileName: parsed.originalFileName,
        resourceKind: parsed.resourceKind,
        uploadedById: user.id,
      },
    });

    return NextResponse.json({ resourceId: resource.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create resource.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
