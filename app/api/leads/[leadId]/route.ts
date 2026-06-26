import { NextResponse } from "next/server";

import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { submitLead, updateLeadDraft } from "@/lib/leads/service";

type RouteContext = {
  params: Promise<{ leadId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "submit_leads");
    const { leadId } = await context.params;
    const payload = await request.json();
    const lead = await updateLeadDraft(user, leadId, payload);

    return NextResponse.json({ leadId: lead.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update lead draft.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "submit_leads");
    const { leadId } = await context.params;
    const payload = await request.json();
    const lead = await submitLead(user, leadId, payload);

    return NextResponse.json({ leadId: lead.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit lead.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
