import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";

import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/shared";

export function createMiddlewareSupabaseClient(request: NextRequest, response: NextResponse) {
  return createServerClient(getSupabaseUrl(), getSupabasePublishableKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
}
