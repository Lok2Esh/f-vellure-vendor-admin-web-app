import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('vellure_token')?.value;
  const userCookieData = request.cookies.get('vellure_user')?.value;
  
  let userRole = null;
  if (userCookieData) {
    try {
      const parsed = JSON.parse(userCookieData);
      userRole = parsed.role;
    } catch {
      // Invalid cookie JSON, ignore
    }
  }

  const { pathname } = request.nextUrl;

  // Define strictly public paths
  const isLandingPage = pathname === '/';
  const isPublicPath = isLandingPage || pathname === '/login' || pathname === '/register';

  // 1. Unauthenticated users:
  // Redirect to login when an unauthenticated user requests a protected route.
  if (!token) {
    if (!isPublicPath) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // The marketing homepage remains available to signed-in and signed-out visitors.
  if (isLandingPage) {
    return NextResponse.next();
  }

  // 2. Authenticated users (Token exists AND role is known):
  if (token && userRole) {
    // VENDOR Logic: If not on a /vendor route, funnel them to their dashboard
    if (userRole === 'VENDOR' && !pathname.startsWith('/vendor')) {
      return NextResponse.redirect(new URL('/vendor/dashboard', request.url));
    }
    
    // ADMIN Logic: If not on an /admin route, funnel them to their dashboard
    if (userRole === 'ADMIN' && !pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

// Ensure middleware runs only on intended routes, ignoring static assets or API calls
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files, JS/CSS bundles)
     * - _next/image (image optimization files)
     * - favicon.ico (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg).*)',
  ],
};
