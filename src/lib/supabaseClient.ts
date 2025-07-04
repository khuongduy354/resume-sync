import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase URL and Anon Key must be provided in environment variables."
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

function createSupabaseServerClient(cookies: {
  getAll: () => any[];
  setAll: (cookies: any[]) => void;
}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase URL and Anon Key must be provided in environment variables."
    );
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies,
  });
}

export { createSupabaseBrowserClient, createSupabaseServerClient };
