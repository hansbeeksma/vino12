import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AGE_COOKIE = "vino12_age_verified";

const PUBLIC_PATHS = ["/api/webhooks", "/_next", "/favicon.ico"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Skip admin routes (separate auth)
  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Skip API routes (handled separately)
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Check age verification cookie for shop routes
  const ageVerified = request.cookies.get(AGE_COOKIE);

  if (!ageVerified) {
    // Allow the page to render - age gate modal will show client-side
    const response = NextResponse.next();
    response.headers.set("x-age-verified", "false");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
