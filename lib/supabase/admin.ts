import { createClient } from "@supabase/supabase-js";

import { getSupabaseUrl } from "@/lib/supabase/shared";

function getSupabaseServiceRoleKey() {
  const value = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!value) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  return value;
}

export function createAdminSupabaseClient() {
  return createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
