import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  website: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }
    const { email, website } = parsed.data;
    if (website) return NextResponse.json({ ok: true });

    const apiKey = process.env.MAILCHIMP_API_KEY;
    const audience = process.env.MAILCHIMP_AUDIENCE_ID;
    const prefix = process.env.MAILCHIMP_SERVER_PREFIX;

    if (apiKey && audience && prefix) {
      const url = `https://${prefix}.api.mailchimp.com/3.0/lists/${audience}/members`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `apikey ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          status: "pending",
          tags: ["website-newsletter"],
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        // Treat "already subscribed" as success-ish
        if (!err.includes("Member Exists")) {
          console.error(err);
          return NextResponse.json({ error: "Subscription failed." }, { status: 502 });
        }
      }
    } else {
      console.log("[newsletter]", email);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
