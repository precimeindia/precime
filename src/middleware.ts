import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Add noindex header for all admin pages
  const isAdminPath = pathname.startsWith("/admin");

  if (isAdminPath) {
    // Allow login page through without auth check
    if (pathname === "/admin/login") {
      const response = NextResponse.next();
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
      return response;
    }

    // Check session for other admin paths
    const response = new NextResponse();
    const session = await getIronSession<SessionData>(request, response, sessionOptions);

    if (!session.isLoggedIn || !session.adminId) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // User is authenticated, allow through with noindex
    const nextResponse = NextResponse.next();
    nextResponse.headers.set("X-Robots-Tag", "noindex, nofollow");
    return nextResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
