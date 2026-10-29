import { StaffRecordForm } from "@/components/staff/StaffRecordForm";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { postFields } from "@/lib/staff/field-defs";
import { pageTitle } from "@/lib/brand";

export const metadata = { title: pageTitle("New post", { staff: true }) };

export default async function NewPostPage() {
  await requireStaff(["content"], "/staff/content/posts/new");
  return (
    <div className="space-y-6">
      <StaffPageHeader eyebrow="Content" title="New post" description="Title, summary, and body for the public insights feed." />
      <StaffPanel>
        <StaffRecordForm collection="posts" fields={postFields} submitLabel="Create post" onSuccessHref="/staff/content/posts" />
      </StaffPanel>
    </div>
  );
}
