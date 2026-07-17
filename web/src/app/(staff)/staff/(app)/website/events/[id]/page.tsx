import { notFound } from "next/navigation";
import { StaffDeleteButton, StaffRecordForm } from "@/components/staff/StaffRecordForm";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { eventFields } from "@/lib/staff/field-defs";
import { getCollectionDoc, relationId, toDateTimeLocal } from "@/lib/staff/records";

function fieldValue(value: unknown, fallback: string | number | boolean | null = "") {
  if (value == null) return fallback;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
  return fallback;
}

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaff(["content", "analyst"], "/staff/website/events");
  const { id } = await params;
  const payload = await getPayloadClient();
  let doc: Record<string, unknown>;
  try {
    doc = (await getCollectionDoc(payload, staff, "events", id, 0)) as unknown as Record<string, unknown>;
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <StaffPageHeader eyebrow="Website" title={String(doc.title)} description={`Slug · ${String(doc.slug)}`} />
      <StaffPanel>
        <StaffRecordForm
          collection="events"
          action="update"
          id={doc.id as string | number}
          fields={eventFields}
          initial={{
            title: fieldValue(doc.title),
            slug: fieldValue(doc.slug),
            status: fieldValue(doc.status, "draft"),
            type: fieldValue(doc.type),
            format: fieldValue(doc.format, "online"),
            pricing: fieldValue(doc.pricing, "free"),
            amount: fieldValue(doc.amount, ""),
            currency: fieldValue(doc.currency, "GHS"),
            capacity: fieldValue(doc.capacity, ""),
            startsAt:
              toDateTimeLocal(doc.startsAt as string | null | undefined) ||
              toDateTimeLocal(doc.date as string | null | undefined),
            endsAt: toDateTimeLocal(doc.endsAt as string | null | undefined),
            time: fieldValue(doc.time),
            host: fieldValue(doc.host),
            venue: fieldValue(doc.venue),
            address: fieldValue(doc.address),
            onlineUrl: fieldValue(doc.onlineUrl),
            summary: fieldValue(doc.summary),
            body: fieldValue(doc.body),
            image: relationId(doc.image),
          }}
          submitLabel="Save event"
          onSuccessHref={`/staff/website/events/${doc.id}`}
        />
        <div className="mt-6 border-t border-white/10 pt-4">
          <StaffDeleteButton collection="events" id={doc.id as string | number} redirectTo="/staff/website/events" />
        </div>
      </StaffPanel>
    </div>
  );
}
