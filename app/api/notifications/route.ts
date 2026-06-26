import { NextResponse } from "next/server";

import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getNotificationCenterData } from "@/lib/notifications/service";

export async function GET(request: Request) {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_notifications");
    const searchParams = new URL(request.url).searchParams;
    const data = await getNotificationCenterData(user, Object.fromEntries(searchParams));

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load notifications.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
