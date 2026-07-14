import { notFound } from "next/navigation";
import { StaffDeleteButton, StaffRecordForm } from "@/components/staff/StaffRecordForm";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { storyFields } from "@/lib/staff/field-defs";
import { getCollectionDoc, relationId } from "@/lib/staff/records";

export default async function EditStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaff(["content", "analyst"], "/staff/website/stories");
  const { id } = await params;
  const payload = await getPayloadClient();
  let doc;
  try {
    doc = await getCollectionDoc(payload, staff, "stories", id, 0);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <StaffPageHeader eyebrow="Website" title={doc.name} description={doc.role} />
      <StaffPanel>
        <StaffRecordForm
          collection="stories"
          action="update"
          id={doc.id}
          fields={storyFields}
          initial={{
            name: doc.name,
            role: doc.role,
            quote: doc.quote,
            image: relationId(doc.image),
          }}
          submitLabel="Save story"
          onSuccessHref={`/staff/website/stories/${doc.id}`}
        />
        <div className="mt-6 border-t border-white/10 pt-4">
          <StaffDeleteButton collection="stories" id={doc.id} redirectTo="/staff/website/stories" />
        </div>
      </StaffPanel>
    </div>
  );
}
