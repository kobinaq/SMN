import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { site } from "@/lib/site";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  type: z.string().min(2),
  message: z.string().min(10),
  website: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
    }
    const data = parsed.data;
    if (data.website) return NextResponse.json({ ok: true });

    const apiKey = process.env.RESEND_API_KEY;
    const ops = process.env.OPS_EMAIL ?? site.email;
    const from = process.env.RESEND_FROM ?? "SMN <onboarding@resend.dev>";

    if (apiKey) {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from,
        to: ops,
        subject: `Contact (${data.type}): ${data.name}`,
        text: `From: ${data.name} <${data.email}>\nType: ${data.type}\n\n${data.message}`,
      });
    } else {
      console.log("[contact]", data);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
