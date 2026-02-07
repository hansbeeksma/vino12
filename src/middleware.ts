import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const AGE_COOKIE = "vino12_age_verified";

const SKIP_PATHS = [
  "/api/webhooks",
  "/_next",
  "/favicon.ico",
  "/auth/callback",
];
const AUTH_REQUIRED_PATHS = ["/account"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static/webhook/callback paths
  if (SKIP_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Skip admin routes (separate auth)
  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Skip API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Create Supabase client for auth check
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Refresh session (important for Supabase Auth)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect auth-required routes
  if (AUTH_REQUIRED_PATHS.some((path) => pathname.startsWith(path))) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // Redirect logged-in users away from login page
  if (pathname === "/login" && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/account";
    return NextResponse.redirect(url);
  }

  // Age verification for shop routes
  const ageVerified = request.cookies.get(AGE_COOKIE);
  if (!ageVerified) {
    response.headers.set("x-age-verified", "false");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
