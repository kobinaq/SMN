import { jwtVerify } from "jose";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Members and staff share Payload's `payload-token` cookie.
 * If a member is logged into /app, /admin receives a non-staff JWT and
 * often renders a blank dashboard. For /admin only, drop member tokens
 * from the request so staff login can render (browser cookie kept for /app).
 */
export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("payload-token")?.value;
  const secret = process.env.PAYLOAD_SECRET;
  if (!token || !secret) {
    return NextResponse.next();
  }

  try {
    const { payload: claims } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    );
    if ((claims as { collection?: string }).collection !== "members") {
      return NextResponse.next();
    }

    const cookieHeader = request.headers.get("cookie") || "";
    const filtered = cookieHeader
      .split(";")
      .map((part) => part.trim())
      .filter((part) => part && !part.startsWith("payload-token="))
      .join("; ");

    const headers = new Headers(request.headers);
    if (filtered) headers.set("cookie", filtered);
    else headers.delete("cookie");

    return NextResponse.next({ request: { headers } });
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
