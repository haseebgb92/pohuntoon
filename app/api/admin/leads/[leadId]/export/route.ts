import { NextResponse } from "next/server";

import { requireActiveUser, requireAdmin, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getAdminLeadById } from "@/lib/leads/queries";
import { markLeadExported } from "@/lib/leads/service";

type RouteContext = {
  params: Promise<{ leadId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const user = requirePermission(requireAdmin(requireActiveUser(await getCurrentUser())), "manage_leads");
    const { leadId } = await context.params;
    const result = await getAdminLeadById(leadId);

    if (!result) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    await markLeadExported(user, leadId);

    return new NextResponse(JSON.stringify(result.lead, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="lead-${leadId}.json"`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to export lead.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
