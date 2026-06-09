import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-secret-change-me"
);
const STAFF_ROLES = ["ADMIN", "SALES", "WAREHOUSE"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  const token = req.cookies.get("session")?.value;
  const loginUrl = new URL("/admin/login", req.url);

  if (!token) return NextResponse.redirect(loginUrl);
  try {
    const { payload } = await jwtVerify(token, secret);
    if (!STAFF_ROLES.includes(payload.role as string)) {
      return NextResponse.redirect(loginUrl);
    }
  } catch {
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/in/:path*"],
};
