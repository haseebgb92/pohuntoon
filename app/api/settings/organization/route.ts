import { NextResponse } from "next/server";

import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { updateOrganizationBranding, updateOrganizationSettings } from "@/lib/settings/service";

export async function PATCH(request: Request) {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "manage_settings");
    const payload = await request.json();
    const organization = payload.branding
      ? await updateOrganizationBranding(user, payload.branding)
      : await updateOrganizationSettings(user, payload);
    return NextResponse.json(organization);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update organization." }, { status: 400 });
  }
}
