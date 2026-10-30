import { NextResponse, type NextRequest } from "next/server";

/**
 * Next decodes dynamic route params before any page code runs. A malformed
 * percent-escape such as `/verify/%E0%A4%A` makes that decode throw, and Next
 * answers with a bare 500 that logs nothing. This proxy runs first, sees the
 * still-encoded path, and sends any path that cannot be decoded to the site
 * 404 instead.
 */

/** Path that matches no route, so Next renders global-not-found with a 404. */
export const UNDECODABLE_PATH_REWRITE = "/__tsa-not-found";

export function hasUndecodableSegment(pathname: string): boolean {
  for (const segment of pathname.split("/")) {
    if (!segment.includes("%")) continue;
    try {
      decodeURIComponent(segment);
    } catch {
      return true;
    }
  }
  return false;
}

export function proxy(request: NextRequest) {
  if (!hasUndecodableSegment(request.nextUrl.pathname)) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = UNDECODABLE_PATH_REWRITE;
  url.search = "";
  return NextResponse.rewrite(url, { status: 404 });
}

export const config = {
  matcher: [
    /*
     * Everything except Next assets, the favicon, and the Payload admin and
     * REST API. Those keep their own handling, and leaving /api out means
     * request bodies (uploads, webhooks) never pass through the proxy.
     */
    "/((?!(?:api|admin)(?:/|$)|_next/static|_next/image|favicon\\.ico).*)",
  ],
};
