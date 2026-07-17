import Link from "next/link";
import { TicketQr } from "@/components/events/TicketQr";
import { PaymentSuccessBeacon } from "@/components/payments/PaymentSuccessBeacon";
import { Button } from "@/components/ui/Button";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireMember } from "@/lib/auth/member";
import { getPayloadClient } from "@/lib/payload";
import { fulfillSuccessfulPayment } from "@/lib/payments/fulfill";
import { paystackConfigured, paystackVerify } from "@/lib/payments/paystack";

type Props = { searchParams: Promise<{ id?: string; reference?: string }> };

export default async function MemberTicketPage({ searchParams }: Props) {
  const member = await requireMember("/app/events");
  const params = await searchParams;
  const payload = await getPayloadClient();
  const p = payload as unknown as {
    find(args: Record<string, unknown>): Promise<{ docs: Array<Record<string, unknown>> }>;
    findByID(args: Record<string, unknown>): Promise<Record<string, unknown>>;
  };

  if (params.reference && paystackConfigured()) {
    try {
      const verified = await paystackVerify(params.reference);
      if (verified.status === "success") {
        await fulfillSuccessfulPayment(payload, params.reference);
      }
    } catch {
      /* verify soft-fail; ticket lookup still runs */
    }
  }

  let registration: Record<string, unknown> | null = null;
  if (params.id) {
    try {
      registration = await p.findByID({
        collection: "event-registrations",
        id: params.id,
        depth: 1,
        overrideAccess: true,
      });
    } catch {
      registration = null;
    }
  } else if (params.reference) {
    const found = await p.find({
      collection: "event-registrations",
      limit: 1,
      depth: 1,
      where: {
        and: [{ member: { equals: member.id } }, { paystackReference: { equals: params.reference } }],
      },
      overrideAccess: true,
    });
    registration = found.docs[0] || null;
  } else {
    const found = await p.find({
      collection: "event-registrations",
      limit: 1,
      depth: 1,
      sort: "-registeredAt",
      where: { member: { equals: member.id } },
      overrideAccess: true,
    });
    registration = found.docs[0] || null;
  }

  if (!registration || String((registration.member as { id?: string })?.id || registration.member) !== String(member.id)) {
    return (
      <div className="space-y-6">
        <StaffPageHeader title="Ticket" hint="Ticket not found." />
        <Button href="/app/events" variant="secondary">
          Back to my events
        </Button>
      </div>
    );
  }

  const event =
    registration.event && typeof registration.event === "object"
      ? (registration.event as Record<string, unknown>)
      : null;
  const code = String(registration.ticketCode || "");
  const status = String(registration.status);
  const onlineUrl = typeof event?.onlineUrl === "string" ? event.onlineUrl : "";
  const format = String(event?.format || "online");
  const confirmed = status === "confirmed" || status === "checked_in";

  return (
    <div className="space-y-6">
      {params.reference ? <PaymentSuccessBeacon kind="event" reference={params.reference} /> : null}
      <StaffPageHeader
        eyebrow={String(event?.type || "Event")}
        title={String(event?.title || "Your ticket")}
        hint={confirmed ? "Show this QR at the door, or join online below." : "Payment still pending."}
      />
      <StaffPanel className="text-center">
        {code && confirmed ? <TicketQr code={code} /> : null}
        <p className="mt-4 font-display text-2xl tracking-wide text-white">{code || "—"}</p>
        <p className="mt-2 text-sm text-white/45">Status · {status.replace("_", " ")}</p>
        {confirmed && onlineUrl && (format === "online" || format === "hybrid") ? (
          <div className="mt-6">
            <Button href={onlineUrl} target="_blank" rel="noreferrer">
              Join class / meeting
            </Button>
          </div>
        ) : null}
        <div className="mt-6">
          <Link href="/app/events" className="text-sm text-baby-blue hover:underline">
            All my tickets
          </Link>
        </div>
      </StaffPanel>
    </div>
  );
}
