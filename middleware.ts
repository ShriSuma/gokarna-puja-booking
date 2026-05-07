import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (pathname === "/admin" || pathname === "/admin/") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }
  const token = request.cookies.get("gp_admin")?.value;
  if (pathname.startsWith("/admin/login")) {
    if (token) return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    return NextResponse.next();
  }
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  // Keep middleware lightweight for Edge runtime compatibility; token creation/verification
  // is still handled by server routes.
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
