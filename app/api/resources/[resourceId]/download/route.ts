import { NextResponse } from "next/server";

import { requireActiveUser, requireOrganizationAccess, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { adminRoles } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db/prisma";
import { createResourceSignedDownloadUrl } from "@/lib/resources/storage";
import { recordResourceDownload } from "@/lib/resources/queries";

type RouteContext = {
  params: Promise<{ resourceId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_resources");
  const { resourceId } = await context.params;

  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
  });

  if (!resource) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  requireOrganizationAccess(user, resource.organizationId);

  if (!adminRoles.includes(user.role) && resource.status !== "ACTIVE") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  await recordResourceDownload(resource.id, user);

  if (resource.resourceKind === "EXTERNAL_LINK") {
    return NextResponse.redirect(resource.fileUrl);
  }

  const signedUrl = await createResourceSignedDownloadUrl(resource.fileUrl);
  return NextResponse.redirect(signedUrl);
}
