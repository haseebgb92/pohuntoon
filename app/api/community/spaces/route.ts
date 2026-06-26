import { NextResponse } from "next/server";

import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getCommunitySpaces, createCommunitySpace } from "@/lib/community/service";

export async function GET() {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_community");
    const spaces = await getCommunitySpaces(user);
    return NextResponse.json({ spaces });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load spaces." }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "manage_community");
    const space = await createCommunitySpace(user, await request.json());
    return NextResponse.json({ spaceId: space.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create space." }, { status: 400 });
  }
}
