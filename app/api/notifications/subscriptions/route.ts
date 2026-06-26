import { NextResponse } from "next/server";

import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { registerNotificationSubscription, removeNotificationSubscription } from "@/lib/notifications/service";

export async function POST(request: Request) {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_notifications");
    const payload = await request.json();
    await registerNotificationSubscription(user, payload, request.headers.get("user-agent"));

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to register push subscription.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_notifications");
    const payload = await request.json();
    await removeNotificationSubscription(user, String(payload.endpoint ?? ""));

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to remove push subscription.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
