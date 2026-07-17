import { notFound } from "next/navigation";
import { StaffDeleteButton, StaffRecordForm } from "@/components/staff/StaffRecordForm";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { courseFields } from "@/lib/staff/field-defs";
import { getCollectionDoc, relationId } from "@/lib/staff/records";

function fieldValue(value: unknown, fallback: string | number | boolean | null = "") {
  if (value == null) return fallback;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
  return fallback;
}

export default async function EditWebsiteCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaff(["content", "analyst"], "/staff/website/courses");
  const { id } = await params;
  const payload = await getPayloadClient();
  let doc: Record<string, unknown>;
  try {
    doc = (await getCollectionDoc(payload, staff, "courses", id, 0)) as unknown as Record<string, unknown>;
  } catch {
    notFound();
  }

  const outcomes = Array.isArray(doc.outcomes)
    ? doc.outcomes
        .map((item) => (typeof item === "object" && item && "item" in item ? String((item as { item: unknown }).item) : ""))
        .filter(Boolean)
        .join("\n")
    : "";

  return (
    <div className="space-y-6">
      <StaffPageHeader eyebrow="Website" title={String(doc.title)} description={`Slug · ${String(doc.slug)}`} />
      <StaffPanel>
        <StaffRecordForm
          collection="courses"
          action="update"
          id={doc.id as string | number}
          fields={courseFields}
          initial={{
            title: fieldValue(doc.title),
            slug: fieldValue(doc.slug),
            summary: fieldValue(doc.summary),
            outcomesText: outcomes,
            duration: fieldValue(doc.duration),
            lessons: fieldValue(doc.lessons, ""),
            price: fieldValue(doc.price),
            amount: fieldValue(doc.amount, ""),
            currency: fieldValue(doc.currency, "GHS"),
            programKey: fieldValue(doc.programKey),
            delivery: fieldValue(doc.delivery, "self-paced"),
            classroomUrl: fieldValue(doc.classroomUrl),
            badge: fieldValue(doc.badge),
            image: relationId(doc.image),
            status: fieldValue(doc.status, "published"),
          }}
          submitLabel="Save course"
          onSuccessHref={`/staff/website/courses/${doc.id}`}
        />
        <div className="mt-6 border-t border-white/10 pt-4">
          <StaffDeleteButton collection="courses" id={doc.id as string | number} redirectTo="/staff/website/courses" />
        </div>
      </StaffPanel>
    </div>
  );
}
