import { NextResponse } from "next/server";

import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { deleteCommunityPost, updateCommunityPost } from "@/lib/community/service";

type RouteContext = { params: Promise<{ postId: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_community");
    const { postId } = await context.params;
    await updateCommunityPost(user, postId, await request.json());
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update post." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_community");
    const { postId } = await context.params;
    await deleteCommunityPost(user, postId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to delete post." }, { status: 400 });
  }
}
