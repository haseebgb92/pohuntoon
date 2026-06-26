import { NextResponse } from "next/server";

import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { updateUserPreferences, updateUserProfile } from "@/lib/settings/service";

export async function PATCH(request: Request) {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_dashboard");
    const payload = await request.json();
    const profile = payload.preferences
      ? await updateUserPreferences(user, payload.preferences)
      : await updateUserProfile(user, payload);
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update profile." }, { status: 400 });
  }
}
