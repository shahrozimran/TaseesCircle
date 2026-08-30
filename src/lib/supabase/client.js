import { createBrowserClient } from "@supabase/ssr";

let client = null;

export function createClient() {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Guard against missing or placeholder env vars (prevents build crashes)
  if (
    !supabaseUrl ||
    !supabaseKey ||
    supabaseUrl === "your_supabase_project_url" ||
    supabaseKey === "your_supabase_anon_key"
  ) {
    return null;
  }

  client = createBrowserClient(supabaseUrl, supabaseKey);
  return client;
}
