import { NextResponse } from "next/server";

import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { searchSettings } from "@/lib/settings/service";

export async function GET(request: Request) {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "view_dashboard");
    const query = new URL(request.url).searchParams.get("query") || "";
    return NextResponse.json(await searchSettings(user, { query }));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to search settings." }, { status: 400 });
  }
}
