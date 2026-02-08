import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AGE_COOKIE = "vino12_age_verified";

const SKIP_PATHS = [
  "/api/webhooks",
  "/_next",
  "/favicon.ico",
  "/auth/callback",
];
const AUTH_REQUIRED_PATHS = ["/account"];

function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return adminEmails.length > 0 && adminEmails.includes(email.toLowerCase());
}

function isContributorEmail(email: string | undefined): boolean {
  if (!email) return false;
  const contributorEmails = (process.env.CONTRIBUTOR_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return (
    contributorEmails.length > 0 &&
    contributorEmails.includes(email.toLowerCase())
  );
}

const CONTRIBUTOR_BLOCKED_PATHS = [
  "/admin/bestellingen",
  "/admin/wijnen",
  "/admin/klanten",
  "/admin/voorraad",
  "/admin/reviews",
  "/admin/instellingen",
  "/admin/leveranciers",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static/webhook/callback paths
  if (SKIP_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Skip API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Guard: skip auth when Supabase env vars are missing
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next();
  }

  try {
    // Dynamic import to avoid Edge runtime issues if package is incompatible
    const { createServerClient } = await import("@supabase/ssr");

    const response = NextResponse.next({
      request: { headers: request.headers },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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

    // Refresh session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Protect admin routes
    if (pathname.startsWith("/admin")) {
      if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
      }

      const hasAdminRole = user.app_metadata?.role === "admin";
      const isAdmin = hasAdminRole || isAdminEmail(user.email);
      const isContributor = isContributorEmail(user.email);

      if (!isAdmin && !isContributor) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/geen-toegang";
        return NextResponse.rewrite(url);
      }

      // Contributors are blocked from admin-only sections
      if (
        isContributor &&
        !isAdmin &&
        CONTRIBUTOR_BLOCKED_PATHS.some((path) => pathname.startsWith(path))
      ) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/geen-toegang";
        return NextResponse.rewrite(url);
      }

      return response;
    }

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
      const redirect = request.nextUrl.searchParams.get("redirect");
      const url = request.nextUrl.clone();
      url.pathname = redirect ?? "/account";
      url.searchParams.delete("redirect");
      return NextResponse.redirect(url);
    }

    // Age verification for shop routes
    const ageVerified = request.cookies.get(AGE_COOKIE);
    if (!ageVerified) {
      response.headers.set("x-age-verified", "false");
    }

    return response;
  } catch {
    // If middleware fails for any reason, don't block the request
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
