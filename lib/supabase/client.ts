"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/shared";

export function createBrowserSupabaseClient() {
  return createBrowserClient(getSupabaseUrl(), getSupabasePublishableKey());
}
