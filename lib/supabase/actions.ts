import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function createActionSupabaseClient() {
  return createServerSupabaseClient();
}
