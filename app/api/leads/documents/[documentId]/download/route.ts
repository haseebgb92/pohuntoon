import { NextResponse } from "next/server";

import { requireActiveUser, requireOrganizationAccess, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { adminRoles } from "@/lib/auth/permissions";
import { prisma } from "@/lib/db/prisma";
import { createLeadDocumentDownloadUrl } from "@/lib/leads/storage";

type RouteContext = {
  params: Promise<{ documentId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_own_leads");
    const { documentId } = await context.params;
    const document = await prisma.leadDocument.findUnique({
      where: { id: documentId },
      include: {
        lead: {
          select: {
            id: true,
            organizationId: true,
            submittedById: true,
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found." }, { status: 404 });
    }

    requireOrganizationAccess(user, document.lead.organizationId);

    if (!adminRoles.includes(user.role) && document.lead.submittedById !== user.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }

    const url = await createLeadDocumentDownloadUrl(document.fileUrl);
    return NextResponse.redirect(url);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to download document.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
