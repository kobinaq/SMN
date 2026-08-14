type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(args: { key: string; limit: number; windowMs: number }) {
  const now = Date.now();
  const current = buckets.get(args.key);
  if (!current || current.resetAt <= now) {
    buckets.set(args.key, { count: 1, resetAt: now + args.windowMs });
    return { ok: true as const };
  }
  if (current.count >= args.limit) {
    return {
      ok: false as const,
      retryAfterSec: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }
  current.count += 1;
  return { ok: true as const };
}

export function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

export function rateLimitedResponse(retryAfterSec: number) {
  return Response.json(
    { error: "Too many attempts. Wait a minute and try again." },
    { status: 429, headers: { "Retry-After": String(retryAfterSec) } },
  );
}
