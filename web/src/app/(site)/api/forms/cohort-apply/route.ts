import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { site } from "@/lib/site";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  country: z.string().min(2),
  role: z.string().min(2),
  level: z.string().min(2),
  linkedin: z.string().optional(),
  portfolio: z.string().optional(),
  goals: z.string().min(10),
  source: z.string().optional(),
  website: z.string().optional(), // honeypot
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
    }

    const data = parsed.data;
    if (data.website) {
      return NextResponse.json({ ok: true });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const ops = process.env.OPS_EMAIL ?? site.email;
    const from = process.env.RESEND_FROM ?? "SMN <onboarding@resend.dev>";

    if (apiKey) {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from,
        to: ops,
        subject: `Cohort application: ${data.name}`,
        text: Object.entries(data)
          .filter(([k]) => k !== "website")
          .map(([k, v]) => `${k}: ${v ?? ""}`)
          .join("\n"),
      });
      await resend.emails.send({
        from,
        to: data.email,
        subject: "We received your SMN cohort application",
        text: `Hi ${data.name},\n\nThanks for applying to the ${site.cohort.name}. Our team will review your application and follow up within 3-5 business days.\n\n${site.name}`,
      });
    } else {
      console.log("[cohort-apply]", data);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
