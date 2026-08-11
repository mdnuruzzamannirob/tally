import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Request-boundary hook for token-independent concerns.
 *
 * Authentication is intentionally handled by the client auth shell because
 * access tokens live in memory and are not available to this proxy.
 */
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login/:path*",
    "/register/:path*",
    "/forgot-password/:path*",
    "/reset-password/:path*",
    "/verify-email/:path*",
    "/dashboard/:path*",
    "/applications/:path*",
    "/interviews/:path*",
    "/settings/:path*",
    "/offline/:path*",
  ],
};
