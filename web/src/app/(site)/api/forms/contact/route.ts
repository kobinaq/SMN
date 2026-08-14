import { NextResponse } from "next/server";
import { z } from "zod";
import { getSiteSettings } from "@/lib/cms";
import { emailWasSent, sendEmail } from "@/lib/email";

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

    const settings = await getSiteSettings();
    const ops = process.env.OPS_EMAIL ?? settings.email;
    const delivery = await sendEmail({
      to: ops,
      subject: `Contact (${data.type}): ${data.name}`,
      text: `From: ${data.name} <${data.email}>\nType: ${data.type}\n\n${data.message}`,
    });

    if (!emailWasSent(delivery)) {
      return NextResponse.json(
        { error: "We could not send that message yet. Email SMN directly or try again later." },
        { status: 503 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
