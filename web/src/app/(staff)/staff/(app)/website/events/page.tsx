import Link from "next/link";
import { redirect } from "next/navigation";
import { StaffEmpty, StaffPageHeader, StaffPanel, StaffTable } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { listCollection } from "@/lib/staff/records";

export default async function WebsiteEventsPage() {
  const staff = await requireStaff(["content", "analyst"], "/staff/website/events");
  // Ops workspace is the primary surface; keep this list as a thin editor index.
  if (process.env.STAFF_EVENTS_OPS_ONLY === "1") {
    redirect("/staff/events");
  }

  const payload = await getPayloadClient();
  const events = await listCollection(payload, staff, "events", { limit: 100, sort: "-startsAt" });

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Website"
        title="Event editor"
        description="Edit listing fields. Prefer Work → Events for attendees and check-in."
        action={{ href: "/staff/website/events/new", label: "New event" }}
      />
      <p className="text-sm text-white/45">
        <Link href="/staff/events" className="text-baby-blue hover:underline">
          Open events ops →
        </Link>
      </p>
      <StaffPanel>
        {events.docs.length ? (
          <StaffTable
            columns={["Title", "Type", "Starts", "Status"]}
            rows={events.docs.map((doc) => {
              const record = doc as unknown as Record<string, unknown>;
              const when = record.startsAt || record.date;
              return {
                key: String(doc.id),
                href: `/staff/website/events/${doc.id}`,
                cells: [
                  doc.title,
                  doc.type,
                  when ? new Date(String(when)).toLocaleString("en-GH") : "—",
                  String(record.status || "—"),
                ],
              };
            })}
          />
        ) : (
          <StaffEmpty>No events yet. Add the next webinar or workshop.</StaffEmpty>
        )}
      </StaffPanel>
    </div>
  );
}
