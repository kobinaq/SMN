import Link from "next/link";
import { notFound } from "next/navigation";
import { StaffDeleteButton, StaffRecordForm } from "@/components/staff/StaffRecordForm";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { lmsLessonFields } from "@/lib/staff/field-defs";
import { getCollectionDoc, relationId } from "@/lib/staff/records";

export default async function EditLessonPage({ params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaff(["learning", "content", "support"], "/staff/learning");
  const { id } = await params;
  const payload = await getPayloadClient();
  let doc;
  try {
    doc = await getCollectionDoc(payload, staff, "lms-lessons", id, 0);
  } catch {
    notFound();
  }

  const courseId = relationId(doc.course);
  const backHref = courseId ? `/staff/learning?course=${courseId}&tab=curriculum` : "/staff/learning?tab=curriculum";

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Course Builder"
        title={String(doc.title || "Lesson")}
        description="Edit the learner-facing summary, video, notes, and publish state for this lesson."
      />
      <p className="text-sm text-white/45">
        <Link href={backHref} className="text-baby-blue hover:underline">
          ← Back to curriculum
        </Link>
      </p>
      <StaffPanel>
        <StaffRecordForm
          collection="lms-lessons"
          action="update"
          id={doc.id}
          fields={lmsLessonFields}
          initial={{
            title: doc.title,
            slug: doc.slug,
            summary: doc.summary,
            lessonType: doc.lessonType,
            youtubeUrl: doc.youtubeUrl || "",
            durationMinutes: doc.durationMinutes ?? "",
            body: doc.body || "",
            status: doc.status || "draft",
          }}
          submitLabel="Save lesson"
          onSuccessHref={`/staff/learning/lessons/${doc.id}`}
        />
        <div className="mt-6 border-t border-white/10 pt-4">
          <StaffDeleteButton collection="lms-lessons" id={doc.id} redirectTo={backHref} />
        </div>
      </StaffPanel>
    </div>
  );
}
