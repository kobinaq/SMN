import { StaffEmpty, StaffPageHeader, StaffPanel, StaffTable } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { listCollection } from "@/lib/staff/records";

export default async function WebsiteEventsPage() {
  const staff = await requireStaff(["content", "analyst"], "/staff/website/events");
  const payload = await getPayloadClient();
  const events = await listCollection(payload, staff, "events", { limit: 100, sort: "-date" });

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Website"
        title="Events"
        description="Webinars, workshops, and community gatherings on the public site."
        action={{ href: "/staff/website/events/new", label: "New event" }}
      />
      <StaffPanel>
        {events.docs.length ? (
          <StaffTable
            columns={["Title", "Type", "Date"]}
            rows={events.docs.map((doc) => ({
              key: String(doc.id),
              href: `/staff/website/events/${doc.id}`,
              cells: [doc.title, doc.type, doc.date ? new Date(doc.date).toLocaleDateString("en-GH") : "—"],
            }))}
          />
        ) : (
          <StaffEmpty>No events yet. Add the next webinar or workshop.</StaffEmpty>
        )}
      </StaffPanel>
    </div>
  );
}
