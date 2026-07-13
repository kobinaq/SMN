import { notFound } from "next/navigation";
import { StaffDeleteButton, StaffRecordForm } from "@/components/staff/StaffRecordForm";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { eventFields } from "@/lib/staff/field-defs";
import { getCollectionDoc, relationId, toDateTimeLocal } from "@/lib/staff/records";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaff(["content", "analyst"], "/staff/website/events");
  const { id } = await params;
  const payload = await getPayloadClient();
  let doc;
  try {
    doc = await getCollectionDoc(payload, staff, "events", id, 0);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <StaffPageHeader eyebrow="Website" title={doc.title} description={`Slug · ${doc.slug}`} />
      <StaffPanel>
        <StaffRecordForm
          collection="events"
          action="update"
          id={doc.id}
          fields={eventFields}
          initial={{
            title: doc.title,
            slug: doc.slug,
            type: doc.type,
            date: toDateTimeLocal(doc.date),
            time: doc.time || "",
            summary: doc.summary,
            registrationUrl: doc.registrationUrl,
            image: relationId(doc.image),
          }}
          submitLabel="Save event"
          onSuccessHref={`/staff/website/events/${doc.id}`}
        />
        <div className="mt-6 border-t border-white/10 pt-4">
          <StaffDeleteButton collection="events" id={doc.id} redirectTo="/staff/website/events" />
        </div>
      </StaffPanel>
    </div>
  );
}
