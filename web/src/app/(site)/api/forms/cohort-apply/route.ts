import { NextResponse } from "next/server";
import { z } from "zod";
import { getSiteSettings } from "@/lib/cms";
import { emailWasSent, sendEmail } from "@/lib/email";
import { getPayloadClient } from "@/lib/payload";

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
    if (data.website) {
      return NextResponse.json({ ok: true });
    }

    const payload = await getPayloadClient();
    const existingMember = await payload.find({
      collection: "members",
      limit: 1,
      depth: 0,
      overrideAccess: true,
      where: { email: { equals: data.email } },
    });

    await payload.create({
      collection: "cohort-applications",
      overrideAccess: true,
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        country: data.country,
        role: data.role,
        level: data.level,
        linkedin: data.linkedin || undefined,
        portfolio: data.portfolio || undefined,
        goals: data.goals,
        source: data.source || undefined,
        status: "received",
        member: existingMember.docs[0]?.id,
      },
    });

    const settings = await getSiteSettings();
    const ops = process.env.OPS_EMAIL ?? settings.email;
    const applicationText = Object.entries(data)
      .filter(([k]) => k !== "website")
      .map(([k, v]) => `${k}: ${v ?? ""}`)
      .join("\n");

    const opsMail = await sendEmail({
      to: ops,
      subject: `Cohort application: ${data.name}`,
      text: applicationText,
    });

    if (emailWasSent(opsMail)) {
      await sendEmail({
        to: data.email,
        subject: "We received your SMN cohort application",
        text: `Hi ${data.name},\n\nThanks for applying to the ${settings.cohort.name}. Our team will review your application and follow up within 3-5 business days.\n\n${settings.name}`,
      });
    }

    return NextResponse.json({ ok: true, emailed: emailWasSent(opsMail) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
