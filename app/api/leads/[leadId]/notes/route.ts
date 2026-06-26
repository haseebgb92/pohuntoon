import { NextResponse } from "next/server";

import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { addLeadNote } from "@/lib/leads/service";

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

    const note = await addLeadNote(
      user,
      leadId,
      {
        note: String(formData.get("note") ?? ""),
        noteType: String(formData.get("noteType") ?? "PARTNER"),
        parentNoteId: String(formData.get("parentNoteId") ?? "") || null,
      },
      files,
    );

    return NextResponse.json({ noteId: note.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to add lead note.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
