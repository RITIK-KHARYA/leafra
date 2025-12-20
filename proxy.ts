import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // If user is on landing page and has a session, redirect to dashboard
  if (request.nextUrl.pathname === "/" && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user doesn't have a session and tries to access protected routes, redirect to signup
  if (
    !sessionCookie &&
    (request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/chat"))
  ) {
    return NextResponse.redirect(new URL("/signup", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard", "/chat/:path*", "/dashboard/chat/:path*"], // Include root path and specify the routes the middleware applies to
};
