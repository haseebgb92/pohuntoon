import { NextResponse } from "next/server";

import { requireActiveUser, requireAdmin, requireOrganizationAccess, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { prisma } from "@/lib/db/prisma";
import { resourceEditSchema } from "@/lib/resources/schemas";
import { deleteResourceFile, uploadResourceFile } from "@/lib/resources/storage";

type RouteContext = {
  params: Promise<{ resourceId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const user = requirePermission(
      requireAdmin(requireActiveUser(await getCurrentUser())),
      "manage_resources",
    );
    const { resourceId } = await context.params;

    const existing = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Resource not found." }, { status: 404 });
    }

    requireOrganizationAccess(user, existing.organizationId);

    const formData = await request.formData();
    const file = formData.get("file");
    const resourceKind = String(formData.get("resourceKind") ?? existing.resourceKind);
    let fileUrl =
      resourceKind === "EXTERNAL_LINK"
        ? String(formData.get("externalUrl") ?? existing.fileUrl)
        : existing.fileUrl;
    let fileType = String(formData.get("fileType") ?? existing.fileType);
    let originalFileName = String(formData.get("originalFileName") ?? existing.originalFileName ?? "");

    if (resourceKind === "FILE" && file instanceof File && file.size > 0) {
      fileUrl = await uploadResourceFile(user.organizationId, file, existing.fileUrl);
      fileType = file.type || fileType || "application/octet-stream";
      originalFileName = file.name;
    } else if (resourceKind === "EXTERNAL_LINK") {
      if (existing.resourceKind === "FILE") {
        await deleteResourceFile(existing.fileUrl);
      }

      fileUrl = String(formData.get("externalUrl") ?? existing.fileUrl);
      fileType = "external-link";
      originalFileName = "";
    }

    const parsed = resourceEditSchema.parse({
      title: String(formData.get("title") ?? existing.title),
      description: String(formData.get("description") ?? existing.description ?? ""),
      category: String(formData.get("category") ?? existing.category),
      version: String(formData.get("version") ?? existing.version ?? ""),
      resourceKind,
      fileUrl,
      externalUrl: String(formData.get("externalUrl") ?? ""),
      fileType,
      originalFileName,
      status: String(formData.get("status") ?? existing.status),
    });

    const resource = await prisma.resource.update({
      where: { id: resourceId },
      data: {
        title: parsed.title,
        description: parsed.description,
        category: parsed.category,
        version: parsed.version,
        resourceKind: parsed.resourceKind,
        fileUrl: parsed.fileUrl,
        fileType: parsed.fileType,
        originalFileName: parsed.originalFileName,
        status: parsed.status,
        uploadedById: user.id,
      },
    });

    return NextResponse.json({ resourceId: resource.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update resource.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = requirePermission(
      requireAdmin(requireActiveUser(await getCurrentUser())),
      "manage_resources",
    );
    const { resourceId } = await context.params;
    const existing = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Resource not found." }, { status: 404 });
    }

    requireOrganizationAccess(user, existing.organizationId);

    await prisma.resource.delete({
      where: { id: resourceId },
    });

    if (existing.resourceKind === "FILE") {
      await deleteResourceFile(existing.fileUrl);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete resource.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
