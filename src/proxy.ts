import { NextRequest,NextResponse } from "next/server";

// Optimistic routing only. Layouts and API handlers verify the session independently.
export function proxy(request: NextRequest) {
  if (process.env.VELLURE_DEMO_MODE === "true") return NextResponse.next();
  if(!request.cookies.has('vellure_session')&&request.cookies.has('vellure_refresh')){
    const url=new URL('/session/renew',request.url);url.searchParams.set('next',request.nextUrl.pathname+request.nextUrl.search);return NextResponse.redirect(url);
  }
  if (!request.cookies.has("vellure_session"))
    return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();
}
export const config = { matcher: ["/vendor/:path*", "/admin/:path*"] };
