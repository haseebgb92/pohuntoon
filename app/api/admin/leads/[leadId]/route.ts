import { NextResponse } from "next/server";

import { requireActiveUser, requireAdmin, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { updateLeadStatus } from "@/lib/leads/service";

type RouteContext = {
  params: Promise<{ leadId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const user = requirePermission(requireAdmin(requireActiveUser(await getCurrentUser())), "manage_leads");
    const { leadId } = await context.params;
    const payload = await request.json();
    const lead = await updateLeadStatus(user, leadId, payload);

    return NextResponse.json({ leadId: lead.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update lead.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
