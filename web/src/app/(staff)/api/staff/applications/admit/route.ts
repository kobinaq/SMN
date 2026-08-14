import { randomBytes } from "crypto";
import { z } from "zod";
import { staffAuthHeaders } from "@/lib/auth/staff";
import { sendEmail } from "@/lib/email";
import { grantCourseEnrollment } from "@/lib/lms-enroll";
import { getPayloadClient } from "@/lib/payload";
import { checkoutPublishedAmountGate, numericId, relationId } from "@/lib/payments/checkout";
import { newPaystackReference, paystackConfigured, paystackInitialize } from "@/lib/payments/paystack";
import { getServerURL } from "@/lib/server-url";
import { canStaff } from "@/lib/staff-permissions";

const schema = z.object({
  applicationId: z.union([z.string(), z.number()]),
  action: z.enum(["grant", "pay-link"]),
  courseId: z.union([z.string(), z.number()]).optional(),
});

async function findOrCreateMember(
  payload: Awaited<ReturnType<typeof getPayloadClient>>,
  args: { name: string; email: string },
) {
  const email = args.email.toLowerCase().trim();
  const existing = await payload.find({
    collection: "members",
    limit: 1,
    depth: 0,
    overrideAccess: true,
    where: { email: { equals: email } },
  });
  if (existing.docs[0]) return { member: existing.docs[0], created: false };

  const member = await payload.create({
    collection: "members",
    overrideAccess: true,
    data: {
      name: args.name.trim() || email,
      email,
      password: `${randomBytes(12).toString("base64url")}Aa1`,
    },
  });
  return { member, created: true };
}

export async function POST(request: Request) {
  try {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await staffAuthHeaders(request) });
    if (!user || user.collection !== "users") {
      return Response.json({ error: "Staff sign-in required." }, { status: 401 });
    }
    if (!canStaff(user as never, "learning", "support", "content")) {
      return Response.json({ error: "You do not have permission to admit applicants." }, { status: 403 });
    }

    const parsed = schema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return Response.json({ error: "Invalid admit request." }, { status: 400 });

    const application = await payload.findByID({
      collection: "cohort-applications",
      id: parsed.data.applicationId,
      depth: 1,
      overrideAccess: true,
    });

    const courseId = numericId(parsed.data.courseId || relationId(application.course));
    if (!courseId) {
      return Response.json({ error: "Attach a course to this application first." }, { status: 400 });
    }

    const course = await payload.findByID({
      collection: "lms-courses",
      id: courseId,
      depth: 0,
      overrideAccess: true,
    });
    if (course.status !== "published") {
      return Response.json({ error: "Publish the course before admitting learners." }, { status: 400 });
    }

    const { member, created } = await findOrCreateMember(payload, {
      name: String(application.name || ""),
      email: String(application.email || ""),
    });

    await payload.update({
      collection: "cohort-applications",
      id: application.id,
      overrideAccess: true,
      data: {
        member: member.id,
        course: course.id,
        status: "accepted",
      },
    });

    const site = getServerURL();
    const loginUrl = `${site}/login`;
    const resetUrl = `${site}/forgot-password`;
    const classroomUrl = typeof course.classroomUrl === "string" ? course.classroomUrl : "";

    if (parsed.data.action === "grant") {
      const enrollment = await grantCourseEnrollment(payload, {
        memberId: member.id,
        course: {
          id: course.id,
          title: course.title,
          programKey: course.programKey,
          slug: course.slug,
          delivery: course.delivery,
          classroomUrl,
        },
        source: course.delivery === "cohort" ? "cohort" : "staff",
      });

      await sendEmail({
        to: String(member.email),
        subject: `You're in: ${course.title}`,
        text: [
          `Hi ${member.name || "there"},`,
          "",
          `You have access to ${course.title} on Social Marketers Network.`,
          created
            ? `We created a member account for ${member.email}. Set your password at ${resetUrl}, then sign in at ${loginUrl}.`
            : `Sign in at ${loginUrl} and open Learning.`,
          classroomUrl ? `Google Classroom invite: ${classroomUrl}` : "",
          "",
          "Social Marketers Network",
        ]
          .filter(Boolean)
          .join("\n"),
      });

      return Response.json({ ok: true, action: "grant", enrollmentId: enrollment.id, memberId: member.id });
    }

    if (!paystackConfigured()) {
      return Response.json({ error: "Payments are not configured yet." }, { status: 503 });
    }

    const gate = checkoutPublishedAmountGate({
      status: course.status,
      amount: course.amount,
      priceConfirmed: course.priceConfirmed,
    });
    if (!gate.ok) {
      return Response.json(
        { error: "Confirm the course fee before sending a payment link." },
        { status: gate.status },
      );
    }

    const reference = newPaystackReference("crs");
    const callbackUrl = `${site}/app/learning?reference=${encodeURIComponent(reference)}`;
    const init = await paystackInitialize({
      email: String(member.email),
      amount: gate.amount,
      currency: String(course.currency || "GHS"),
      reference,
      callbackUrl,
      metadata: {
        kind: "course",
        memberId: String(member.id),
        courseId: String(course.id),
        applicationId: String(application.id),
      },
    });

    await payload.create({
      collection: "payments",
      overrideAccess: true,
      data: {
        kind: "course",
        member: numericId(member.id),
        amount: gate.amount,
        currency: String(course.currency || "GHS"),
        status: "initialized",
        paystackReference: init.reference,
        paystackAccessCode: init.accessCode,
        course: numericId(course.id),
        application: numericId(application.id),
        metadata: { callbackUrl, source: "staff-pay-link" },
      },
    });

    await sendEmail({
      to: String(member.email),
      subject: `Payment link for ${course.title}`,
      text: [
        `Hi ${member.name || "there"},`,
        "",
        `Complete payment for ${course.title} using this link:`,
        init.authorizationUrl,
        created
          ? `We created a member account for ${member.email}. After payment, set your password at ${resetUrl} and sign in at ${loginUrl}.`
          : `After payment, sign in at ${loginUrl} and open Learning.`,
        "",
        "Social Marketers Network",
      ].join("\n"),
    });

    return Response.json({
      ok: true,
      action: "pay-link",
      authorizationUrl: init.authorizationUrl,
      memberId: member.id,
    });
  } catch (error) {
    console.error("[staff-admit]", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to admit this applicant." },
      { status: 500 },
    );
  }
}
