import { NextResponse } from "next/server";

import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createLeadDraft } from "@/lib/leads/service";

export async function POST(request: Request) {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "submit_leads");
    const payload = await request.json();
    const lead = await createLeadDraft(user, payload);

    return NextResponse.json({ leadId: lead.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create lead draft.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
