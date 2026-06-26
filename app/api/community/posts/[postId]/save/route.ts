import { NextResponse } from "next/server";

import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { toggleSavedPost } from "@/lib/community/service";

type RouteContext = { params: Promise<{ postId: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_community");
    const { postId } = await context.params;
    const result = await toggleSavedPost(user, postId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save post." }, { status: 400 });
  }
}
