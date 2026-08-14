import { NextResponse } from "next/server";
import { z } from "zod";
import { getSiteSettings } from "@/lib/cms";
import { sendEmail } from "@/lib/email";
import { subscribeToNewsletter } from "@/lib/newsletter";
import { getResource } from "@/lib/resources";
import { clientKey, rateLimit, rateLimitedResponse } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email(),
  resource: z.string().min(1),
  website: z.string().optional(), // honeypot
});

function absoluteUrl(pathOrUrl: string, base: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  try {
    return new URL(pathOrUrl, base).toString();
  } catch {
    return pathOrUrl;
  }
}

export async function POST(req: Request) {
  try {
    const limited = rateLimit({ key: `resource-download:${clientKey(req)}`, limit: 8, windowMs: 15 * 60 * 1000 });
    if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    const { email, resource: slug, website } = parsed.data;
    if (website) return NextResponse.json({ ok: true, delivered: true });

    const resource = await getResource(slug);
    if (!resource) {
      return NextResponse.json({ error: "That resource is no longer available." }, { status: 404 });
    }

    const subscription = await subscribeToNewsletter(email, [
      "website-newsletter",
      `resource:${slug}`,
    ]);
    if (!subscription.ok) {
      return NextResponse.json({ error: subscription.error }, { status: 502 });
    }

    // Staff may not have attached a file yet; the resource page still carries the
    // material, so it is the honest fallback target rather than a dead link.
    const settings = await getSiteSettings();
    const downloadUrl = absoluteUrl(resource.fileUrl ?? `/resources/${slug}`, settings.url);
    const delivery = await sendEmail({
      to: email,
      subject: `Your download: ${resource.title}`,
      text: [
        `Here is the resource you requested.`,
        ``,
        `${resource.title}`,
        downloadUrl,
        ``,
        `You are also on the SMN list for occasional strategy notes. Unsubscribe anytime.`,
        ``,
        settings.name,
      ].join("\n"),
    });

    if (!delivery.ok && delivery.reason === "error") {
      return NextResponse.json(
        { error: "We could not send that email. Use the direct link below.", downloadUrl },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      delivered: delivery.ok,
      downloadUrl,
      hasFile: Boolean(resource.fileUrl),
    });
  } catch (error) {
    console.error("[resource-download]", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
