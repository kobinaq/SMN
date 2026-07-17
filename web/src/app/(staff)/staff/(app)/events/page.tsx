import Link from "next/link";
import { StaffEmptyState, StaffMetricGrid, StaffPageHeader, StaffPanel, StaffSection, StaffTable } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { Button } from "@/components/ui/Button";

export default async function StaffEventsOpsPage() {
  const staff = await requireStaff(["content", "support", "analyst"], "/staff/events");
  const payload = await getPayloadClient();
  const p = payload as unknown as {
    find(args: Record<string, unknown>): Promise<{ docs: Array<Record<string, unknown>>; totalDocs: number }>;
    count(args: Record<string, unknown>): Promise<{ totalDocs: number }>;
  };

  const events = await p.find({
    collection: "events",
    limit: 100,
    sort: "-startsAt",
    depth: 0,
    overrideAccess: false,
    user: staff,
  });

  const published = events.docs.filter((item) => item.status === "published").length;
  const paid = events.docs.filter((item) => item.pricing === "paid").length;

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Work"
        title="Events"
        hint="Publish sessions, manage capacity, and check people in."
        action={{ href: "/staff/website/events/new", label: "New event" }}
      />
      <StaffMetricGrid
        items={[
          { label: "Events", value: events.totalDocs },
          { label: "Published", value: published },
          { label: "Paid", value: paid },
        ]}
      />
      <StaffPanel>
        <StaffSection title="All events" />
        {events.docs.length ? (
          <StaffTable
            columns={["Title", "When", "Format", "Pricing", "Status", ""]}
            rows={events.docs.map((doc) => ({
              key: String(doc.id),
              cells: [
                String(doc.title),
                doc.startsAt ? new Date(String(doc.startsAt)).toLocaleString("en-GH") : String(doc.date || "—"),
                String(doc.format || "—"),
                String(doc.pricing || "—"),
                String(doc.status || "—"),
                <span key="actions" className="flex flex-wrap gap-2">
                  <Link href={`/staff/website/events/${doc.id}`} className="text-xs text-baby-blue hover:underline">
                    Edit
                  </Link>
                  <Link href={`/staff/events/${doc.id}`} className="text-xs text-baby-blue hover:underline">
                    Attendees
                  </Link>
                  <Link href={`/staff/events/${doc.id}/check-in`} className="text-xs text-baby-blue hover:underline">
                    Check-in
                  </Link>
                </span>,
              ],
            }))}
          />
        ) : (
          <StaffEmptyState
            title="No events yet"
            steps={[
              { label: "Create event", href: "/staff/website/events/new", active: true },
              { label: "Publish" },
              { label: "Check in guests" },
            ]}
            action={{ href: "/staff/website/events/new", label: "New event" }}
          />
        )}
      </StaffPanel>
      <Button href="/staff/website/events" variant="secondary">
        Website event list
      </Button>
    </div>
  );
}
