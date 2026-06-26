import { NextResponse } from "next/server";

import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { reportCommunityContent } from "@/lib/community/service";

export async function POST(request: Request) {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_community");
    const report = await reportCommunityContent(user, await request.json());
    return NextResponse.json({ reportId: report.id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to report content." }, { status: 400 });
  }
}
