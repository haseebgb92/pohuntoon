import { NextResponse } from "next/server";

import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { markAllNotificationsRead } from "@/lib/notifications/service";

export async function POST() {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_notifications");
    await markAllNotificationsRead(user);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to mark notifications read.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
