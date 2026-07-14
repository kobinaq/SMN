import { notFound } from "next/navigation";
import { StaffDeleteButton, StaffRecordForm } from "@/components/staff/StaffRecordForm";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { courseFields } from "@/lib/staff/field-defs";
import { getCollectionDoc, relationId } from "@/lib/staff/records";

export default async function EditWebsiteCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaff(["content", "analyst"], "/staff/website/courses");
  const { id } = await params;
  const payload = await getPayloadClient();
  let doc;
  try {
    doc = await getCollectionDoc(payload, staff, "courses", id, 0);
  } catch {
    notFound();
  }

  const outcomes = Array.isArray(doc.outcomes)
    ? doc.outcomes.map((item) => (typeof item === "object" && item && "item" in item ? String(item.item) : "")).filter(Boolean).join("\n")
    : "";

  return (
    <div className="space-y-6">
      <StaffPageHeader eyebrow="Website" title={doc.title} description={`Slug · ${doc.slug}`} />
      <StaffPanel>
        <StaffRecordForm
          collection="courses"
          action="update"
          id={doc.id}
          fields={courseFields}
          initial={{
            title: doc.title,
            slug: doc.slug,
            summary: doc.summary,
            outcomesText: outcomes,
            duration: doc.duration || "",
            lessons: doc.lessons ?? "",
            price: doc.price || "",
            selarUrl: doc.selarUrl,
            badge: doc.badge || "",
            image: relationId(doc.image),
            status: doc.status,
          }}
          submitLabel="Save course"
          onSuccessHref={`/staff/website/courses/${doc.id}`}
        />
        <div className="mt-6 border-t border-white/10 pt-4">
          <StaffDeleteButton collection="courses" id={doc.id} redirectTo="/staff/website/courses" />
        </div>
      </StaffPanel>
    </div>
  );
}
