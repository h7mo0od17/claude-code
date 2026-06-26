import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "autofx-dev-secret-change-in-production"
)

const PROTECTED_PATHS = ["/dashboard"]
const ADMIN_PATHS = ["/admin"]
const AUTH_PATHS = ["/login", "/register"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin paths
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const adminToken = request.cookies.get("autofx-admin-session")?.value
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
    try {
      const { payload } = await jwtVerify(adminToken, JWT_SECRET)
      if (!payload.adminId) throw new Error("Not an admin token")
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // Client dashboard paths
  if (pathname.startsWith("/dashboard")) {
    const sessionToken = request.cookies.get("autofx-session")?.value
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login?redirect=" + encodeURIComponent(pathname), request.url))
    }
    try {
      const { payload } = await jwtVerify(sessionToken, JWT_SECRET)
      if (!payload.userId) throw new Error("Invalid session")
    } catch {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}
