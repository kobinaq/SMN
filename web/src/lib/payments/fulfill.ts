import type { Payload } from "payload";
import { sendEmail } from "@/lib/email";
import { formatMinorAmount, newTicketCode } from "@/lib/payments/paystack";
import { getServerURL } from "@/lib/server-url";

/** Loose Payload surface until generate:types includes payments / event-registrations. */
type DB = {
  find(args: Record<string, unknown>): Promise<{ docs: Array<Record<string, unknown>> }>;
  findByID(args: Record<string, unknown>): Promise<Record<string, unknown>>;
  create(args: Record<string, unknown>): Promise<Record<string, unknown>>;
  update(args: Record<string, unknown>): Promise<Record<string, unknown>>;
  count(args: Record<string, unknown>): Promise<{ totalDocs: number }>;
};

function db(payload: Payload): DB {
  return payload as unknown as DB;
}

function relId(value: unknown) {
  if (value && typeof value === "object" && "id" in value) return String((value as { id: string | number }).id);
  return value == null ? "" : String(value);
}

async function memberEmail(payload: Payload, memberId: string) {
  try {
    const member = await db(payload).findByID({
      collection: "members",
      id: memberId,
      depth: 0,
      overrideAccess: true,
    });
    return {
      email: String(member.email || ""),
      name: String(member.name || "there"),
    };
  } catch {
    return { email: "", name: "there" };
  }
}

async function notifyEventConfirmed(
  payload: Payload,
  memberId: string,
  eventTitle: string,
  ticketCode: string,
  registrationId: string | number,
  onlineUrl?: string,
) {
  const member = await memberEmail(payload, memberId);
  if (!member.email) return;
  const site = getServerURL();
  const ticketUrl = `${site}/app/events/tickets?id=${registrationId}`;
  const joinLine = onlineUrl ? `\nJoin link: ${onlineUrl}\n` : "\n";
  await sendEmail({
    to: member.email,
    subject: `You're registered: ${eventTitle}`,
    text: `Hi ${member.name},\n\nYou're confirmed for ${eventTitle}.\n\nTicket code: ${ticketCode}${joinLine}\nView your ticket: ${ticketUrl}\n\nSocial Marketers Network`,
  });
}

async function notifyCourseReceipt(
  payload: Payload,
  memberId: string,
  programName: string,
  amount: number,
  currency: string,
  classroomUrl?: string,
) {
  const member = await memberEmail(payload, memberId);
  if (!member.email) return;
  const site = getServerURL();
  const classLine = classroomUrl ? `\nJoin Classroom: ${classroomUrl}\n` : "\n";
  await sendEmail({
    to: member.email,
    subject: `Payment received: ${programName}`,
    text: `Hi ${member.name},\n\nWe received your payment of ${formatMinorAmount(amount, currency)} for ${programName}.${classLine}\nOpen learning: ${site}/app/learning\n\nSocial Marketers Network`,
  });
}

/** Idempotent success handler for event or course payments. */
export async function fulfillSuccessfulPayment(payload: Payload, reference: string) {
  const p = db(payload);
  const existing = await p.find({
    collection: "payments",
    limit: 1,
    depth: 0,
    where: { paystackReference: { equals: reference } },
    overrideAccess: true,
  });
  const payment = existing.docs[0];
  if (!payment) return { ok: false as const, reason: "payment_not_found" as const };
  if (payment.status === "success") return { ok: true as const, already: true as const, payment };

  const kind = String(payment.kind);
  const memberId = relId(payment.member);

  if (kind === "event") {
    const eventId = relId(payment.event);
    const event = await p.findByID({
      collection: "events",
      id: eventId,
      depth: 0,
      overrideAccess: true,
    });

    if (event.capacity) {
      const taken = await countConfirmedRegistrations(payload, eventId, { excludePendingRef: reference });
      if (taken >= Number(event.capacity)) {
        await p.update({
          collection: "payments",
          id: payment.id,
          data: { status: "failed", metadata: { ...(payment.metadata as object), capacityExceeded: true } },
          overrideAccess: true,
        });
        const pending = await p.find({
          collection: "event-registrations",
          limit: 1,
          depth: 0,
          where: {
            and: [
              { event: { equals: eventId } },
              { member: { equals: memberId } },
              { paystackReference: { equals: reference } },
            ],
          },
          overrideAccess: true,
        });
        if (pending.docs[0]) {
          await p.update({
            collection: "event-registrations",
            id: pending.docs[0].id,
            data: { status: "cancelled" },
            overrideAccess: true,
          });
        }
        return { ok: false as const, reason: "capacity_exceeded" as const };
      }
    }

    const regs = await p.find({
      collection: "event-registrations",
      limit: 1,
      depth: 0,
      where: {
        and: [
          { event: { equals: eventId } },
          { member: { equals: memberId } },
          { paystackReference: { equals: reference } },
        ],
      },
      overrideAccess: true,
    });
    let registration = regs.docs[0];
    const ticketCode = (registration?.ticketCode as string) || newTicketCode();

    if (registration) {
      registration = await p.update({
        collection: "event-registrations",
        id: registration.id,
        data: {
          status: "confirmed",
          ticketCode,
          amountPaid: payment.amount,
          currency: payment.currency,
          registeredAt: new Date().toISOString(),
        },
        overrideAccess: true,
      });
    } else {
      registration = await p.create({
        collection: "event-registrations",
        data: {
          event: eventId,
          member: memberId,
          status: "confirmed",
          ticketCode,
          paystackReference: reference,
          amountPaid: payment.amount,
          currency: payment.currency,
          registeredAt: new Date().toISOString(),
        },
        overrideAccess: true,
      });
    }

    await p.update({
      collection: "payments",
      id: payment.id,
      data: { status: "success", eventRegistration: registration.id },
      overrideAccess: true,
    });

    await notifyEventConfirmed(
      payload,
      memberId,
      String(event.title || "SMN event"),
      ticketCode,
      registration.id as string | number,
      typeof event.onlineUrl === "string" ? event.onlineUrl : undefined,
    );

    return { ok: true as const, kind: "event" as const, registration, payment };
  }

  if (kind === "course") {
    const courseId = relId(payment.catalogueCourse);
    const course = await p.findByID({
      collection: "courses",
      id: courseId,
      depth: 0,
      overrideAccess: true,
    });

    const programKey = String(course.programKey || course.slug || "");
    let classroomUrl = typeof course.classroomUrl === "string" ? course.classroomUrl : "";
    const lmsCourseId = relId(course.lmsCourse) || undefined;

    if (!classroomUrl && lmsCourseId) {
      try {
        const lms = await p.findByID({
          collection: "lms-courses",
          id: lmsCourseId,
          depth: 0,
          overrideAccess: true,
        });
        if (typeof lms.classroomUrl === "string" && lms.classroomUrl) classroomUrl = lms.classroomUrl;
      } catch {
        /* optional */
      }
    }

    const prior = await p.find({
      collection: "enrollments",
      limit: 1,
      depth: 0,
      where: {
        and: [{ member: { equals: memberId } }, { programKey: { equals: programKey } }],
      },
      overrideAccess: true,
    });

    let enrollment = prior.docs[0];
    if (enrollment) {
      enrollment = await p.update({
        collection: "enrollments",
        id: enrollment.id,
        data: {
          status: "active",
          source: "paystack",
          externalReference: reference,
          classroomUrl: classroomUrl || enrollment.classroomUrl || undefined,
          course: lmsCourseId || enrollment.course || undefined,
        },
        overrideAccess: true,
      });
    } else {
      enrollment = await p.create({
        collection: "enrollments",
        data: {
          member: memberId,
          programName: String(course.title || "Programme"),
          programKey,
          programType: course.delivery === "live" ? "Cohort" : "Self-paced course",
          source: "paystack",
          externalReference: reference,
          status: "active",
          classroomUrl: classroomUrl || undefined,
          course: lmsCourseId || undefined,
          startedAt: new Date().toISOString(),
        },
        overrideAccess: true,
      });
    }

    await p.update({
      collection: "payments",
      id: payment.id,
      data: { status: "success", enrollment: enrollment.id },
      overrideAccess: true,
    });

    await notifyCourseReceipt(
      payload,
      memberId,
      String(course.title || "Programme"),
      Number(payment.amount || 0),
      String(payment.currency || "GHS"),
      classroomUrl || undefined,
    );

    return { ok: true as const, kind: "course" as const, enrollment, payment };
  }

  await p.update({
    collection: "payments",
    id: payment.id,
    data: { status: "failed" },
    overrideAccess: true,
  });
  return { ok: false as const, reason: "unknown_kind" as const };
}

export async function countConfirmedRegistrations(
  payload: Payload,
  eventId: string | number,
  opts?: { excludePendingRef?: string },
) {
  const and: Array<Record<string, unknown>> = [
    { event: { equals: eventId } },
    { status: { in: ["confirmed", "checked_in", "pending_payment"] } },
  ];
  if (opts?.excludePendingRef) {
    and.push({
      or: [
        { paystackReference: { not_equals: opts.excludePendingRef } },
        { paystackReference: { exists: false } },
      ],
    });
  }
  const result = await db(payload).count({
    collection: "event-registrations",
    where: { and },
    overrideAccess: true,
  });
  return result.totalDocs;
}

export async function registerForFreeEvent(payload: Payload, eventId: string | number, memberId: string | number) {
  const p = db(payload);
  const existing = await p.find({
    collection: "event-registrations",
    limit: 1,
    depth: 0,
    where: {
      and: [
        { event: { equals: eventId } },
        { member: { equals: memberId } },
        { status: { in: ["confirmed", "checked_in", "pending_payment"] } },
      ],
    },
    overrideAccess: true,
  });
  if (existing.docs[0]) return existing.docs[0];

  const event = await p.findByID({
    collection: "events",
    id: eventId,
    depth: 0,
    overrideAccess: true,
  });

  if (event.capacity) {
    const taken = await countConfirmedRegistrations(payload, eventId);
    if (taken >= Number(event.capacity)) {
      throw new Error("This event is full.");
    }
  }

  const registration = await p.create({
    collection: "event-registrations",
    data: {
      event: eventId,
      member: memberId,
      status: "confirmed",
      ticketCode: newTicketCode(),
      amountPaid: 0,
      currency: event.currency || "GHS",
      registeredAt: new Date().toISOString(),
    },
    overrideAccess: true,
  });

  await notifyEventConfirmed(
    payload,
    String(memberId),
    String(event.title || "SMN event"),
    String(registration.ticketCode || ""),
    registration.id as string | number,
    typeof event.onlineUrl === "string" ? event.onlineUrl : undefined,
  );

  return registration;
}

export async function cancelEventRegistration(
  payload: Payload,
  registrationId: string | number,
  opts?: { refund?: boolean },
) {
  const p = db(payload);
  const registration = await p.findByID({
    collection: "event-registrations",
    id: registrationId,
    depth: 0,
    overrideAccess: true,
  });

  if (registration.status === "cancelled") return { ok: true as const, registration, refunded: false };

  const updated = await p.update({
    collection: "event-registrations",
    id: registrationId,
    data: { status: "cancelled" },
    overrideAccess: true,
  });

  let refunded = false;
  const reference = typeof registration.paystackReference === "string" ? registration.paystackReference : "";
  if (opts?.refund && reference && Number(registration.amountPaid || 0) > 0) {
    const { paystackRefund } = await import("@/lib/payments/paystack");
    await paystackRefund(reference);
    refunded = true;
    const payments = await p.find({
      collection: "payments",
      limit: 1,
      depth: 0,
      where: { paystackReference: { equals: reference } },
      overrideAccess: true,
    });
    if (payments.docs[0]) {
      await p.update({
        collection: "payments",
        id: payments.docs[0].id,
        data: {
          status: "failed",
          metadata: { ...(payments.docs[0].metadata as object), refunded: true },
        },
        overrideAccess: true,
      });
    }
  }

  return { ok: true as const, registration: updated, refunded };
}
