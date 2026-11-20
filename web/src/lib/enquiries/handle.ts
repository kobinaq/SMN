import { enquiryRateLimit } from "@/lib/enquiries/options";
import { isHoneypotFilled, parseEnquiryBody, type EnquiryInput } from "@/lib/enquiries/schema";

export type EnquiryDeps = {
  clientKey: (request: Request) => string;
  limit: (args: { key: string; limit: number; windowMs: number }) =>
    | { ok: true }
    | { ok: false; retryAfterSec: number };
  findNewsletterDuplicate: (email: string) => Promise<boolean>;
  create: (input: EnquiryInput) => Promise<{ id: number | string }>;
  notify: (input: EnquiryInput, id: number | string) => Promise<void>;
  subscribe: (email: string) => Promise<void>;
};

function json(body: unknown, status: number, headers?: HeadersInit) {
  return Response.json(body, { status, headers });
}

async function quietly(label: string, task: () => Promise<void>) {
  try {
    await task();
  } catch (error) {
    console.error(label, error);
  }
}

export async function handleEnquiry(request: Request, deps: EnquiryDeps): Promise<Response> {
  const limited = deps.limit({
    key: `enquiries:${deps.clientKey(request)}`,
    limit: enquiryRateLimit.limit,
    windowMs: enquiryRateLimit.windowMs,
  });
  if (!limited.ok) {
    return json(
      { ok: false, error: "rate_limited" },
      429,
      { "Retry-After": String(limited.retryAfterSec) },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_json", fieldErrors: {} }, 400);
  }

  if (isHoneypotFilled(body)) return json({ ok: true }, 200);

  const parsed = parseEnquiryBody(body);
  if (!parsed.ok) {
    return json({ ok: false, error: "validation_error", fieldErrors: parsed.fieldErrors }, 400);
  }

  const input = parsed.data;

  try {
    if (input.type === "newsletter") {
      const duplicate = await deps.findNewsletterDuplicate(input.email);
      if (duplicate) {
        await quietly("[enquiries] newsletter subscribe failed", () => deps.subscribe(input.email));
        return json({ ok: true }, 200);
      }
    }

    const created = await deps.create(input);
    if (input.type === "newsletter") {
      await quietly("[enquiries] newsletter subscribe failed", () => deps.subscribe(input.email));
    }
    await quietly("[enquiries] notification failed", () => deps.notify(input, created.id));
    return json({ ok: true, id: String(created.id) }, 201);
  } catch (error) {
    console.error("[enquiries] store failed", error);
    return json({ ok: false, error: "server_error" }, 500);
  }
}
