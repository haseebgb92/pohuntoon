import { NextResponse } from "next/server";

import { requireActiveUser, requirePermission } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { adminGlobalSearch } from "@/lib/admin/service";

export async function GET(request: Request) {
  try {
    const user = requirePermission(requireActiveUser(await getCurrentUser()), "manage_users");
    const query = new URL(request.url).searchParams.get("query") || "";
    const results = await adminGlobalSearch(user, { query });
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to search." }, { status: 400 });
  }
}
