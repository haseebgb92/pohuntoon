import { NextResponse } from "next/server";

import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { updateAdminUser } from "@/lib/admin/service";

type RouteContext = { params: Promise<{ userId: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "manage_users");
    const { userId } = await context.params;
    const updated = await updateAdminUser(user, userId, await request.json());
    return NextResponse.json({ userId: updated.id });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update user." }, { status: 400 });
  }
}
