import { NextResponse } from "next/server";

import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getAdminUsers, inviteAdminUser } from "@/lib/admin/service";

export async function GET(request: Request) {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "manage_users");
    const users = await getAdminUsers(user, Object.fromEntries(new URL(request.url).searchParams));
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load users." }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "manage_users");
    const invited = await inviteAdminUser(user, await request.json());
    return NextResponse.json({ userId: invited.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to invite user." }, { status: 400 });
  }
}
