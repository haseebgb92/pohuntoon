import { NextResponse } from "next/server";

import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createCommunityComment } from "@/lib/community/service";

type RouteContext = { params: Promise<{ postId: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_community");
    const { postId } = await context.params;
    const comment = await createCommunityComment(user, postId, await request.json());
    return NextResponse.json({ commentId: comment.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to add comment." }, { status: 400 });
  }
}
