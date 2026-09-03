import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client using the SERVICE_ROLE key.
 * This client bypasses RLS and should ONLY be used in
 * trusted server-side API routes (never exposed to the client).
 *
 * Use this for:
 *  - Writing contact/newsletter submissions (H-02)
 *  - Any trusted server-side write that needs to bypass RLS
 */
export function createServiceClient() {
  const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (
    !supabaseUrl ||
    !serviceRoleKey ||
    supabaseUrl === "your_supabase_project_url" ||
    serviceRoleKey === "your_supabase_service_role_key"
  ) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
