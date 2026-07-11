import { jwtVerify } from "jose";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Payload uses one cookie (`payload-token`) for all auth collections.
 * A member session from /login would make /admin think someone is logged in
 * who is not staff → blank black admin UI.
 *
 * On /admin only, ignore member tokens so the staff login form can render.
 * Does not clear the browser cookie, so /app stays logged in.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("payload-token")?.value;
  if (!token) {
    return NextResponse.next();
  }

  const secret = process.env.PAYLOAD_SECRET;
  if (!secret) {
    return NextResponse.next();
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    const collection = (payload as { collection?: string }).collection;

    if (collection === "members") {
      // Rebuild Cookie header without payload-token for this request only
      const cookieHeader = request.headers.get("cookie") || "";
      const filtered = cookieHeader
        .split(";")
        .map((c) => c.trim())
        .filter((c) => c && !c.startsWith("payload-token="))
        .join("; ");

      const headers = new Headers(request.headers);
      if (filtered) {
        headers.set("cookie", filtered);
      } else {
        headers.delete("cookie");
      }

      return NextResponse.next({
        request: { headers },
      });
    }
  } catch {
    // Invalid token — leave as-is; Payload will treat as logged out
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
