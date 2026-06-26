import { NextResponse } from "next/server";

import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createCommunityPost, getCommunityHomeData } from "@/lib/community/service";

export async function GET(request: Request) {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_community");
    const data = await getCommunityHomeData(user, Object.fromEntries(new URL(request.url).searchParams));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load community." }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_community");
    const post = await createCommunityPost(user, await request.json());
    return NextResponse.json({ postId: post.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create post." }, { status: 400 });
  }
}
