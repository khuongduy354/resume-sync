import { createBrowserClient } from "@supabase/ssr";
import { createServerClient } from "@supabase/ssr";

function createSupabaseBrowserClient(trackCookies = true) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase URL and Anon Key must be provided in environment variables."
    );
  }

  let options: any = {};
  if (trackCookies && typeof document !== "undefined") {
    options.cookies = {
      getAll: () =>
        document.cookie.split("; ").map((cookie) => {
          const [name, value] = cookie.split("=");
          return { name, value };
        }),
      setAll: (cookies: { name: string; value: string }[]) => {
        cookies.forEach(({ name, value }) => {
          document.cookie = `${name}=${value}; path=/;`;
        });
      },
    };
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey, options);
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
