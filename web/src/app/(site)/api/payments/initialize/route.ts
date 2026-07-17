import { z } from "zod";
import { memberAuthHeaders } from "@/lib/auth/member";
import { getPayloadClient } from "@/lib/payload";
import { getServerURL } from "@/lib/server-url";
import { countConfirmedRegistrations } from "@/lib/payments/fulfill";
import {
  newPaystackReference,
  newTicketCode,
  paystackConfigured,
  paystackInitialize,
} from "@/lib/payments/paystack";

const schema = z.object({
  kind: z.enum(["event", "course"]),
  eventId: z.union([z.string(), z.number()]).optional(),
  courseId: z.union([z.string(), z.number()]).optional(),
});

type DB = {
  find(args: Record<string, unknown>): Promise<{ docs: Array<Record<string, unknown>> }>;
  findByID(args: Record<string, unknown>): Promise<Record<string, unknown>>;
  create(args: Record<string, unknown>): Promise<Record<string, unknown>>;
  update(args: Record<string, unknown>): Promise<Record<string, unknown>>;
};

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

    const p = payload as unknown as DB;
    const memberEmail = String((user as { email?: string }).email || "");
    if (!memberEmail) {
      return Response.json({ error: "Member email is required for checkout." }, { status: 400 });
    }

    const site = getServerURL();
    let amount = 0;
    let currency = "GHS";
    let reference = "";
    let eventId: string | number | undefined;
    let courseId: string | number | undefined;
    let registrationId: string | number | undefined;

    if (parsed.data.kind === "event") {
      if (!parsed.data.eventId) return Response.json({ error: "Event required." }, { status: 400 });
      eventId = parsed.data.eventId;
      const event = await p.findByID({ collection: "events", id: eventId, depth: 0, overrideAccess: true });
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

      const prior = await p.find({
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
      const registration = await p.create({
        collection: "event-registrations",
        data: {
          event: eventId,
          member: user.id,
          status: "pending_payment",
          ticketCode: newTicketCode(),
          paystackReference: reference,
          currency,
          registeredAt: new Date().toISOString(),
        },
        overrideAccess: true,
      });
      registrationId = registration.id as string | number;
    } else {
      if (!parsed.data.courseId) return Response.json({ error: "Course required." }, { status: 400 });
      courseId = parsed.data.courseId;
      const course = await p.findByID({ collection: "courses", id: courseId, depth: 0, overrideAccess: true });
      if (course.status === "coming-soon") {
        return Response.json({ error: "This programme is coming soon." }, { status: 400 });
      }
      amount = Number(course.amount || 0);
      currency = String(course.currency || "GHS");
      if (!amount || amount < 100) {
        return Response.json({ error: "Programme price is not configured." }, { status: 400 });
      }
      if (!course.programKey) {
        return Response.json({ error: "Programme access key is missing." }, { status: 400 });
      }
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

    await p.create({
      collection: "payments",
      data: {
        kind: parsed.data.kind,
        member: user.id,
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
