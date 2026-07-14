import { StaffRecordForm } from "@/components/staff/StaffRecordForm";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { storyFields } from "@/lib/staff/field-defs";

export default async function NewStoryPage() {
  await requireStaff(["content"], "/staff/website/stories/new");
  return (
    <div className="space-y-6">
      <StaffPageHeader eyebrow="Website" title="New story" description="Add a community quote for the public stories section." />
      <StaffPanel>
        <StaffRecordForm collection="stories" fields={storyFields} submitLabel="Create story" onSuccessHref="/staff/website/stories" />
      </StaffPanel>
    </div>
  );
}
