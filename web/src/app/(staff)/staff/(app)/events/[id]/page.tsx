import Link from "next/link";
import { notFound } from "next/navigation";
import { RegistrationCancelActions } from "@/components/staff/RegistrationCancelActions";
import { StaffDeleteButton, StaffRecordForm } from "@/components/staff/StaffRecordForm";
import { StaffOpsRow, StaffPageHeader, StaffPanel, StaffSection } from "@/components/staff/ui";
import { Button } from "@/components/ui/Button";
import { requireStaff } from "@/lib/auth/staff";
import { canStaff } from "@/lib/staff-permissions";
import { getPayloadClient } from "@/lib/payload";
import { countConfirmedRegistrations } from "@/lib/payments/fulfill";
import { eventFields } from "@/lib/staff/field-defs";
import { relationId, toDateTimeLocal } from "@/lib/staff/records";

type Props = { params: Promise<{ id: string }> };

function fieldValue(value: unknown, fallback: string | number | boolean | null = "") {
  if (value == null) return fallback;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
  return fallback;
}

/**
 * One page per event.
 *
 * Editing an event and seeing who is coming to it used to be two routes under
 * two different sections — /staff/website/events/[id] and /staff/events/[id] —
 * over the same record. Whichever one you opened, the thing you wanted next was
 * on the other, so they are one workspace now.
 */
export default async function StaffEventPage({ params }: Props) {
  const staff = await requireStaff(["content", "support", "analyst"], "/staff/events");
  const { id } = await params;
  const payload = await getPayloadClient();
  const p = payload as unknown as {
    findByID(args: Record<string, unknown>): Promise<Record<string, unknown>>;
    find(args: Record<string, unknown>): Promise<{ docs: Array<Record<string, unknown>> }>;
  };

  let event: Record<string, unknown>;
  try {
    event = await p.findByID({ collection: "events", id, depth: 0, overrideAccess: false, user: staff });
  } catch {
    notFound();
  }

  const regs = await p.find({
    collection: "event-registrations",
    depth: 1,
    limit: 500,
    sort: "-registeredAt",
    where: { event: { equals: id } },
    overrideAccess: true,
  });

  const taken = await countConfirmedRegistrations(payload, id);
  const capacity = typeof event.capacity === "number" ? event.capacity : null;
  // Editing is a content role; support and analyst can still run the door.
  const canEdit = canStaff(staff, "content");

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Events"
        title={String(event.title)}
        hint={`${regs.docs.length} registrations${capacity ? ` · ${taken}/${capacity} holding seats` : ""}`}
      >
        <Button href={`/staff/events/${id}/check-in`}>Check-in</Button>
        <Button href="/staff/events" variant="secondary">
          All events
        </Button>
      </StaffPageHeader>

      <StaffPanel>
        <StaffSection title="Attendees" />
        {regs.docs.length ? (
          regs.docs.map((item) => {
            const member =
              item.member && typeof item.member === "object" ? (item.member as Record<string, unknown>) : null;
            const status = String(item.status);
            const canRefund = Number(item.amountPaid || 0) > 0 && Boolean(item.paystackReference);
            return (
              <StaffOpsRow
                key={String(item.id)}
                title={String(member?.name || member?.email || "Member")}
                detail={`${status} · ${String(item.ticketCode || "—")}`}
              >
                <RegistrationCancelActions
                  registrationId={item.id as string | number}
                  status={status}
                  canRefund={canRefund}
                />
              </StaffOpsRow>
            );
          })
        ) : (
          <p className="text-sm text-text-3">No registrations yet.</p>
        )}
      </StaffPanel>

      {canEdit ? (
        <StaffPanel>
          <StaffSection title="Event details" aside={<span className="text-xs text-text-3">Shown on the public listing</span>} />
          <StaffRecordForm
            collection="events"
            action="update"
            id={event.id as string | number}
            fields={eventFields}
            initial={{
              title: fieldValue(event.title),
              slug: fieldValue(event.slug),
              status: fieldValue(event.status, "draft"),
              type: fieldValue(event.type),
              format: fieldValue(event.format, "online"),
              pricing: fieldValue(event.pricing, "free"),
              amount: fieldValue(event.amount, ""),
              currency: fieldValue(event.currency, "GHS"),
              capacity: fieldValue(event.capacity, ""),
              startsAt:
                toDateTimeLocal(event.startsAt as string | null | undefined) ||
                toDateTimeLocal(event.date as string | null | undefined),
              endsAt: toDateTimeLocal(event.endsAt as string | null | undefined),
              time: fieldValue(event.time),
              host: fieldValue(event.host),
              venue: fieldValue(event.venue),
              address: fieldValue(event.address),
              onlineUrl: fieldValue(event.onlineUrl),
              summary: fieldValue(event.summary),
              body: fieldValue(event.body),
              image: relationId(event.image),
            }}
            submitLabel="Save event"
            onSuccessHref={`/staff/events/${event.id}`}
          />
          <div className="mt-6 border-t border-edge-subtle pt-4">
            <StaffDeleteButton collection="events" id={event.id as string | number} redirectTo="/staff/events" />
          </div>
        </StaffPanel>
      ) : null}

      <p className="text-xs text-text-3">
        Public page:{" "}
        <Link href={`/events/${event.slug}`} className="text-accent hover:underline">
          /events/{String(event.slug)}
        </Link>
      </p>
    </div>
  );
}
