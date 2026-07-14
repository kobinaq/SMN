import Link from "next/link";
import { notFound } from "next/navigation";
import { StaffDeleteButton, StaffRecordForm } from "@/components/staff/StaffRecordForm";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { lmsModuleFields } from "@/lib/staff/field-defs";
import { getCollectionDoc, relationId } from "@/lib/staff/records";

export default async function EditModulePage({ params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaff(["learning", "content", "support"], "/staff/learning");
  const { id } = await params;
  const payload = await getPayloadClient();
  let doc;
  try {
    doc = await getCollectionDoc(payload, staff, "lms-modules", id, 0);
  } catch {
    notFound();
  }

  const courseId = relationId(doc.course);
  const backHref = courseId ? `/staff/learning?course=${courseId}&tab=curriculum` : "/staff/learning?tab=curriculum";

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Course Builder"
        title={String(doc.title || "Module")}
        description="Edit this module’s title, summary, and publish state."
      />
      <p className="text-sm text-white/45">
        <Link href={backHref} className="text-baby-blue hover:underline">
          ← Back to curriculum
        </Link>
      </p>
      <StaffPanel>
        <StaffRecordForm
          collection="lms-modules"
          action="update"
          id={doc.id}
          fields={lmsModuleFields}
          initial={{
            title: doc.title,
            slug: doc.slug,
            summary: doc.summary || "",
            status: doc.status || "draft",
          }}
          submitLabel="Save module"
          onSuccessHref={`/staff/learning/modules/${doc.id}`}
        />
        <div className="mt-6 border-t border-white/10 pt-4">
          <StaffDeleteButton collection="lms-modules" id={doc.id} redirectTo={backHref} />
        </div>
      </StaffPanel>
    </div>
  );
}
