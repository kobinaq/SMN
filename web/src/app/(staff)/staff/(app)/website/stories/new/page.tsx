import { StaffRecordForm } from "@/components/staff/StaffRecordForm";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { storyFields } from "@/lib/staff/field-defs";

export default async function NewStoryPage() {
  await requireStaff(["content"], "/staff/website/stories/new");
  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Website"
        title="New story"
        description="Write the full quote for /stories. Tick permission and Published to show it on the public site. The homepage uses a short excerpt."
      />
      <StaffPanel>
        <StaffRecordForm collection="stories" fields={storyFields} submitLabel="Create story" onSuccessHref="/staff/website/stories" />
      </StaffPanel>
    </div>
  );
}
