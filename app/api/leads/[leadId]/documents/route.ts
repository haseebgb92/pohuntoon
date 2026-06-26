import { NextResponse } from "next/server";

import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { addLeadDocuments } from "@/lib/leads/service";
import { validateUploadFiles } from "@/lib/utils/uploads";

type RouteContext = {
  params: Promise<{ leadId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_own_leads");
    const { leadId } = await context.params;
    const formData = await request.formData();
    const files = formData
      .getAll("files")
      .filter((value): value is File => value instanceof File && value.size > 0);

    validateUploadFiles(files);
    const uploadedCount = await addLeadDocuments(user, leadId, files);

    return NextResponse.json({ uploadedCount }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to upload lead documents.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
