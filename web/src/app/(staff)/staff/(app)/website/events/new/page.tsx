import { StaffRecordForm } from "@/components/staff/StaffRecordForm";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { eventFields } from "@/lib/staff/field-defs";

export default async function NewEventPage() {
  await requireStaff(["content"], "/staff/website/events/new");
  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Events"
        title="New event"
        description="Create a free or paid event with capacity, venue or online link, then publish for member registration."
      />
      <StaffPanel>
        <StaffRecordForm
          collection="events"
          fields={eventFields}
          initial={{
            status: "draft",
            format: "online",
            pricing: "free",
            currency: "GHS",
            type: "Webinar",
          }}
          submitLabel="Create event"
          onSuccessHref="/staff/events"
        />
      </StaffPanel>
    </div>
  );
}
