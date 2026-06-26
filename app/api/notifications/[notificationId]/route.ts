import { NextResponse } from "next/server";

import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { deleteNotification, markNotificationRead } from "@/lib/notifications/service";

type RouteContext = {
  params: Promise<{ notificationId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_notifications");
    const { notificationId } = await context.params;
    const payload = await request.json().catch(() => ({ read: true }));
    const notification = await markNotificationRead(user, notificationId, payload.read !== false);

    return NextResponse.json({ notificationId: notification.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update notification.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_notifications");
    const { notificationId } = await context.params;
    await deleteNotification(user, notificationId);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete notification.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
