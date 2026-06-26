import { NextResponse } from "next/server";

import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getNotificationPreferences, updateNotificationPreferences } from "@/lib/notifications/service";

export async function GET() {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_notifications");
    const preferences = await getNotificationPreferences(user);

    return NextResponse.json(preferences);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load notification preferences.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_notifications");
    const payload = await request.json();
    const preferences = await updateNotificationPreferences(user, payload);

    return NextResponse.json(preferences);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update notification preferences.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
