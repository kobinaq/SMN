import { StaffRecordForm } from "@/components/staff/StaffRecordForm";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { eventFields } from "@/lib/staff/field-defs";

export default async function NewEventPage() {
  await requireStaff(["content"], "/staff/website/events/new");
  return (
    <div className="space-y-6">
      <StaffPageHeader eyebrow="Website" title="New event" description="Create a public event listing with registration link." />
      <StaffPanel>
        <StaffRecordForm collection="events" fields={eventFields} submitLabel="Create event" onSuccessHref="/staff/website/events" />
      </StaffPanel>
    </div>
  );
}
