import { NextResponse } from "next/server";
import { z } from "zod";
import { subscribeToNewsletter } from "@/lib/newsletter";

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

    const result = await subscribeToNewsletter(email);
    if (result.ok && result.skipped) {
      return NextResponse.json(
        { error: "Email signup is not available yet. Join the WhatsApp community instead." },
        { status: 503 },
      );
    }
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
