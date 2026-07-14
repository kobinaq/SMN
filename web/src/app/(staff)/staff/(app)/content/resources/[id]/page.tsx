import { notFound } from "next/navigation";
import { StaffDeleteButton, StaffRecordForm } from "@/components/staff/StaffRecordForm";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { resourceFields } from "@/lib/staff/field-defs";
import { getCollectionDoc, relationId } from "@/lib/staff/records";

export default async function EditResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaff(["content", "learning", "analyst"], "/staff/content/resources");
  const { id } = await params;
  const payload = await getPayloadClient();
  let doc;
  try {
    doc = await getCollectionDoc(payload, staff, "resources", id, 0);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <StaffPageHeader eyebrow="Content" title={doc.title} description={`Slug · ${doc.slug}`} />
      <StaffPanel>
        <StaffRecordForm
          collection="resources"
          action="update"
          id={doc.id}
          fields={resourceFields}
          initial={{
            title: doc.title,
            slug: doc.slug,
            type: doc.type,
            description: doc.description,
            file: relationId(doc.file),
          }}
          submitLabel="Save resource"
          onSuccessHref={`/staff/content/resources/${doc.id}`}
        />
        <div className="mt-6 border-t border-white/10 pt-4">
          <StaffDeleteButton collection="resources" id={doc.id} redirectTo="/staff/content/resources" />
        </div>
      </StaffPanel>
    </div>
  );
}
