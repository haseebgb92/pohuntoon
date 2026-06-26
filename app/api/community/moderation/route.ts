import { NextResponse } from "next/server";

import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getModerationQueue, moderateCommunityContent } from "@/lib/community/service";

export async function GET() {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "manage_community");
    const queue = await getModerationQueue(user);
    return NextResponse.json({ queue });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load moderation queue." }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "manage_community");
    await moderateCommunityContent(user, await request.json());
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to moderate content." }, { status: 400 });
  }
}
