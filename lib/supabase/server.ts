import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/shared";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(getSupabaseUrl(), getSupabasePublishableKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server components may not be able to write cookies directly.
        }
      },
    },
  });
}
