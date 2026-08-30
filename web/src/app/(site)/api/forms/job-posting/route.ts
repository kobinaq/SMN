import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSiteSettings } from "@/lib/cms";
import { emailWasSent, sendEmail } from "@/lib/email";
import { getPayloadClient } from "@/lib/payload";
import { clientKey, rateLimit, rateLimitedResponse } from "@/lib/rate-limit";
import { normalizeApplyTarget, slugify } from "./normalize";

/**
 * Employer-submitted job postings.
 *
 * These used to arrive as a freeform "Job posting" contact email that a staff
 * member had to read and re-key into a listing by hand. Here the employer
 * fills structured fields that map straight onto the `opportunities`
 * collection, so the submission lands as a `pending` listing in the Jobs
 * triage queue — ready for staff to publish with one click, no re-keying.
 *
 * `sourceLabel: "partner"` distinguishes these from the automated ATS imports
 * ("imported") and staff's own entries ("manual"); `status: "pending"` keeps
 * every submission behind staff review before it can reach the public board.
 */
const schema = z.object({
  posterName: z.string().min(2).max(120),
  posterEmail: z.string().email(),
  company: z.string().min(2).max(160),
  title: z.string().min(2).max(180),
  type: z.enum(["Full-time", "Part-time", "Contract", "Freelance", "Internship", "Volunteer"]),
  workMode: z.enum(["Remote", "Hybrid", "On-site", "Unspecified"]),
  experienceLevel: z.enum(["Entry level", "Mid-level", "Senior", "Lead / Head", "Any level"]),
  location: z.string().min(2).max(160),
  salary: z.string().max(160).optional(),
  applyTo: z.string().min(3).max(400),
  description: z.string().min(30).max(8000),
  website: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const limited = rateLimit({ key: `job-posting:${clientKey(req)}`, limit: 8, windowMs: 15 * 60 * 1000 });
    if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
    }
    const data = parsed.data;
    if (data.website) return NextResponse.json({ ok: true });

    const applicationUrl = normalizeApplyTarget(data.applyTo);
    if (!applicationUrl) {
      return NextResponse.json({ error: "Enter a valid application link or email address." }, { status: 400 });
    }

    const description = data.description.trim();
    const payload = await getPayloadClient();

    // Create the listing first — this is the durable record. Email is a
    // best-effort notification after, so a mail outage never loses a posting.
    const created = await payload.create({
      collection: "opportunities",
      overrideAccess: true,
      data: {
        title: data.title.trim(),
        company: data.company.trim(),
        summary: description.slice(0, 320),
        description,
        type: data.type,
        workMode: data.workMode,
        experienceLevel: data.experienceLevel,
        location: data.location.trim(),
        salary: data.salary?.trim() || undefined,
        applicationUrl,
        slug: `${slugify(data.company)}-${slugify(data.title)}-${randomUUID().replace(/-/g, "").slice(0, 8)}`,
        sourceLabel: "partner",
        status: "pending",
      },
    });

    const settings = await getSiteSettings();
    const ops = process.env.OPS_EMAIL ?? settings.email;
    const summaryText = [
      `A partner submitted a job posting for staff review.`,
      ``,
      `Role: ${data.title}`,
      `Company: ${data.company}`,
      `Type: ${data.type} · ${data.workMode} · ${data.experienceLevel}`,
      `Location: ${data.location}`,
      data.salary ? `Salary: ${data.salary}` : null,
      `Apply: ${applicationUrl}`,
      ``,
      `Submitted by: ${data.posterName} <${data.posterEmail}>`,
      ``,
      description,
      ``,
      `Review it in the Jobs queue: ${settings.url}/staff/opportunities`,
    ]
      .filter((line) => line !== null)
      .join("\n");

    const opsMail = await sendEmail({
      to: ops,
      subject: `Job posting for review: ${data.title} — ${data.company}`,
      text: summaryText,
    });

    if (emailWasSent(opsMail)) {
      await sendEmail({
        to: data.posterEmail,
        subject: "We received your job posting",
        text: `Hi ${data.posterName},\n\nThanks for sharing "${data.title}" at ${data.company}. Our team reviews every listing before it goes live on the SMN careers board, and we'll be in touch if we need anything.\n\n${settings.name}`,
      });
    }

    return NextResponse.json({ ok: true, id: created.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
