// utils/authMiddleware.ts
import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseClient";

// A wrapper function that check user authentication
export async function withAuth(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    let supabaseResponse = NextResponse.next({
      request,
    });

    // initialize client
    const supabase = createSupabaseServerClient({
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: any[]) {
        // set cookies in the request object
        cookiesToSet.forEach(({ name, value, options }: any) =>
          request.cookies.set(name, value)
        );
        // set cookies in the response object
        cookiesToSet.forEach(({ name, value, options }: any) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    });

    // validate user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (
      !user &&
      !request.nextUrl.pathname.startsWith("/login") &&
      !request.nextUrl.pathname.startsWith("/auth")
    ) {
      // no user, potentially respond by redirecting the user to the login page
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // Merge cookies from Supabase with handler's response
    const handlerResponse = await handler(request);

    supabaseResponse.cookies.getAll().forEach((cookie) => {
      handlerResponse.cookies.set(cookie);
    });

    return handlerResponse;
  };
}
