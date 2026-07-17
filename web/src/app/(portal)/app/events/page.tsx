import Link from "next/link";
import { requireMember } from "@/lib/auth/member";
import { getPayloadClient } from "@/lib/payload";
import { StaffEmptyState, StaffPageHeader, StaffPanel } from "@/components/staff/ui";

export default async function MemberEventsPage() {
  const member = await requireMember("/app/events");
  const payload = await getPayloadClient();
  const p = payload as unknown as {
    find(args: Record<string, unknown>): Promise<{ docs: Array<Record<string, unknown>> }>;
  };

  const regs = await p.find({
    collection: "event-registrations",
    depth: 1,
    limit: 100,
    sort: "-registeredAt",
    where: {
      and: [
        { member: { equals: member.id } },
        { status: { in: ["confirmed", "checked_in", "pending_payment"] } },
      ],
    },
    overrideAccess: true,
  });

  return (
    <div className="space-y-6">
      <StaffPageHeader eyebrow="Member" title="My events" hint="Tickets and join links for sessions you registered for." />
      <StaffPanel>
        {regs.docs.length ? (
          <div className="space-y-2">
            {regs.docs.map((item) => {
              const event = item.event && typeof item.event === "object" ? (item.event as Record<string, unknown>) : null;
              return (
                <Link
                  key={String(item.id)}
                  href={`/app/events/tickets?id=${item.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 px-4 py-3 transition hover:bg-white/[.03]"
                >
                  <span>
                    <b className="block text-sm text-white">{String(event?.title || "Event")}</b>
                    <small className="text-xs text-white/40">
                      {String(item.status)} · {String(item.ticketCode || "Pending")}
                    </small>
                  </span>
                  <span className="text-xs text-baby-blue">Open →</span>
                </Link>
              );
            })}
          </div>
        ) : (
          <StaffEmptyState
            title="No tickets yet"
            action={{ href: "/events", label: "Browse events" }}
          />
        )}
      </StaffPanel>
    </div>
  );
}
