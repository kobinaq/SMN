import { z } from "zod";
import { memberAuthHeaders } from "@/lib/auth/member";
import { getPayloadClient } from "@/lib/payload";
import { checkoutCourseGate, numericId } from "@/lib/payments/checkout";
import { countConfirmedRegistrations } from "@/lib/payments/fulfill";
import {
  newPaystackReference,
  newTicketCode,
  paystackConfigured,
  paystackInitialize,
} from "@/lib/payments/paystack";
import { getServerURL } from "@/lib/server-url";

const schema = z.object({
  kind: z.enum(["event", "course"]),
  eventId: z.union([z.string(), z.number()]).optional(),
  courseId: z.union([z.string(), z.number()]).optional(),
});

export async function POST(request: Request) {
  try {
    if (!paystackConfigured()) {
      return Response.json({ error: "Payments are not configured yet." }, { status: 503 });
    }

    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await memberAuthHeaders() });
    if (!user || user.collection !== "members") {
      return Response.json({ error: "Member sign-in required." }, { status: 401 });
    }

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json({ error: "Invalid checkout request." }, { status: 400 });
    }

    const memberEmail = String((user as { email?: string }).email || "");
    if (!memberEmail) {
      return Response.json({ error: "Member email is required for checkout." }, { status: 400 });
    }

    const site = getServerURL();
    let amount = 0;
    let currency = "GHS";
    let reference = "";
    let eventId: number | undefined;
    let courseId: number | undefined;
    let registrationId: number | undefined;

    if (parsed.data.kind === "event") {
      if (!parsed.data.eventId) return Response.json({ error: "Event required." }, { status: 400 });
      eventId = numericId(parsed.data.eventId);
      const event = await payload.findByID({
        collection: "events",
        id: eventId,
        depth: 0,
        overrideAccess: true,
      });
      if (event.status !== "published") {
        return Response.json({ error: "Event is not open for registration." }, { status: 400 });
      }
      if (event.pricing !== "paid") {
        return Response.json({ error: "This event is free — use register instead." }, { status: 400 });
      }
      amount = Number(event.amount || 0);
      currency = String(event.currency || "GHS");
      if (!amount || amount < 100) {
        return Response.json({ error: "Event price is not configured." }, { status: 400 });
      }
      if (event.capacity) {
        const taken = await countConfirmedRegistrations(payload, eventId);
        if (taken >= Number(event.capacity)) {
          return Response.json({ error: "This event is full." }, { status: 409 });
        }
      }

      const prior = await payload.find({
        collection: "event-registrations",
        limit: 1,
        depth: 0,
        where: {
          and: [
            { event: { equals: eventId } },
            { member: { equals: user.id } },
            { status: { in: ["confirmed", "checked_in"] } },
          ],
        },
        overrideAccess: true,
      });
      if (prior.docs[0]) {
        return Response.json({ error: "You are already registered.", ticketId: prior.docs[0].id }, { status: 409 });
      }

      reference = newPaystackReference("evt");
      const registration = await payload.create({
        collection: "event-registrations",
        data: {
          event: eventId,
          member: numericId(user.id),
          status: "pending_payment",
          ticketCode: newTicketCode(),
          paystackReference: reference,
          currency,
          registeredAt: new Date().toISOString(),
        },
        overrideAccess: true,
      });
      registrationId = numericId(registration.id);
    } else {
      if (!parsed.data.courseId) return Response.json({ error: "Course required." }, { status: 400 });
      courseId = numericId(parsed.data.courseId);
      const course = await payload.findByID({
        collection: "courses",
        id: courseId,
        depth: 1,
        overrideAccess: true,
      });
      const lms = typeof course.lmsCourse === "object" && course.lmsCourse ? course.lmsCourse : null;
      const gate = checkoutCourseGate({
        status: course.status,
        amount: course.amount,
        lmsCourse: lms || course.lmsCourse,
        lmsStatus: lms && "status" in lms ? lms.status : undefined,
      });
      if (!gate.ok) return Response.json({ error: gate.error }, { status: gate.status });
      amount = gate.amount;
      currency = String(course.currency || "GHS");
      reference = newPaystackReference("crs");
    }

    const callbackUrl =
      parsed.data.kind === "event"
        ? `${site}/app/events/tickets?reference=${encodeURIComponent(reference)}`
        : `${site}/app/learning?reference=${encodeURIComponent(reference)}`;

    const init = await paystackInitialize({
      email: memberEmail,
      amount,
      currency,
      reference,
      callbackUrl,
      metadata: {
        kind: parsed.data.kind,
        memberId: String(user.id),
        eventId: eventId ? String(eventId) : undefined,
        courseId: courseId ? String(courseId) : undefined,
      },
    });

    await payload.create({
      collection: "payments",
      data: {
        kind: parsed.data.kind,
        member: numericId(user.id),
        amount,
        currency,
        status: "initialized",
        paystackReference: init.reference,
        paystackAccessCode: init.accessCode,
        event: eventId,
        catalogueCourse: courseId,
        eventRegistration: registrationId,
        metadata: { callbackUrl },
      },
      overrideAccess: true,
    });

    return Response.json({
      ok: true,
      authorizationUrl: init.authorizationUrl,
      reference: init.reference,
      accessCode: init.accessCode,
    });
  } catch (error) {
    console.error("[payments-initialize]", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to start checkout." },
      { status: 500 },
    );
  }
}
