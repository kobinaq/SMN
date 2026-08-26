import Link from "next/link";
import { Card, PageHeader } from "@/components/ui/Surface";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/Feedback";
import { Button } from "@/components/ui/Button";
import { requireMember } from "@/lib/auth/member";
import { getPayloadClient } from "@/lib/payload";

export const metadata = { title: "My events" };

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
      <PageHeader eyebrow="Member" title="My events" description="Tickets and join links for sessions you registered for." />
      {regs.docs.length ? (
        <div className="rise-stagger space-y-2">
          {regs.docs.map((item, index) => {
            const event = item.event && typeof item.event === "object" ? (item.event as Record<string, unknown>) : null;
            return (
              <Card
                key={String(item.id)}
                href={`/app/events/tickets?id=${item.id}`}
                padded={false}
                style={{ "--i": index } as React.CSSProperties}
                className="flex items-center justify-between gap-3 px-4 py-3"
              >
                <span>
                  <b className="block text-sm text-text-1">{String(event?.title || "Event")}</b>
                  <span className="mt-0.5 flex items-center gap-2 text-xs text-text-3">
                    <Chip tone={item.status === "confirmed" || item.status === "checked_in" ? "ai" : "warn"}>
                      {String(item.status).replace("_", " ")}
                    </Chip>
                    {item.ticketCode ? <span className="tnum">{String(item.ticketCode)}</span> : null}
                  </span>
                </span>
                <span className="text-xs text-accent">Open →</span>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No tickets yet"
          description="Register for an SMN event to see your ticket and join link here."
          action={
            <Button href="/events" variant="secondary">
              Browse events
            </Button>
          }
        />
      )}
      <p className="text-sm text-text-3">
        Looking for the public calendar?{" "}
        <Link href="/events" className="text-accent hover:underline">
          See all events
        </Link>
        .
      </p>
    </div>
  );
}
