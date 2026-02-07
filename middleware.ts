import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AGE_COOKIE_NAME = 'vino12-age-verified'

// Routes that require age verification (server-side check)
const PROTECTED_PATHS = ['/wijnen', '/wijn/', '/winkelwagen', '/afrekenen']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only check protected paths
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path))
  if (!isProtected) return NextResponse.next()

  // Check age verification cookie
  const ageVerified = request.cookies.get(AGE_COOKIE_NAME)?.value === '1'

  if (!ageVerified) {
    // Redirect to homepage where the AgeGate modal will show
    const url = request.nextUrl.clone()
    url.pathname = '/'
    url.searchParams.set('age-required', '1')
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/wijnen/:path*', '/wijn/:path*', '/winkelwagen/:path*', '/afrekenen/:path*'],
}
