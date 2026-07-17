import Link from "next/link";
import { notFound } from "next/navigation";
import { RegistrationCancelActions } from "@/components/staff/RegistrationCancelActions";
import { StaffOpsRow, StaffPageHeader, StaffPanel, StaffSection } from "@/components/staff/ui";
import { Button } from "@/components/ui/Button";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { countConfirmedRegistrations } from "@/lib/payments/fulfill";

type Props = { params: Promise<{ id: string }> };

export default async function StaffEventAttendeesPage({ params }: Props) {
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

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Events"
        title={String(event.title)}
        hint={`${regs.docs.length} registrations${capacity ? ` · ${taken}/${capacity} holding seats` : ""}`}
        action={{ href: `/staff/events/${id}/check-in`, label: "Check-in" }}
      />
      <div className="flex flex-wrap gap-2">
        <Button href={`/staff/website/events/${id}`} variant="secondary">
          Edit event
        </Button>
        <Button href="/staff/events" variant="ghost">
          All events
        </Button>
      </div>
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
          <p className="text-sm text-white/45">No registrations yet.</p>
        )}
      </StaffPanel>
      <p className="text-xs text-white/35">
        Public page:{" "}
        <Link href={`/events/${event.slug}`} className="text-baby-blue hover:underline">
          /events/{String(event.slug)}
        </Link>
      </p>
    </div>
  );
}
