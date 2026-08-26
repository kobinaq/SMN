import Link from "next/link";
import { notFound } from "next/navigation";
import { AssessmentEditor } from "@/components/staff/AssessmentEditor";
import { StaffDeleteButton } from "@/components/staff/StaffRecordForm";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { getCollectionDoc, relationId, staffAccess, toDateTimeLocal } from "@/lib/staff/records";

export default async function EditAssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaff(["learning", "support"], "/staff/learning");
  const { id } = await params;
  const payload = await getPayloadClient();
  let doc;
  try {
    doc = await getCollectionDoc(payload, staff, "lms-assessments", id, 0);
  } catch {
    notFound();
  }

  const courseId = relationId(doc.course);
  const access = staffAccess(staff);
  const [modules, lessons] = courseId
    ? await Promise.all([
        payload.find({ collection: "lms-modules", depth: 0, limit: 200, where: { course: { equals: courseId } }, ...access }),
        payload.find({ collection: "lms-lessons", depth: 0, limit: 500, where: { course: { equals: courseId } }, ...access }),
      ])
    : [{ docs: [] }, { docs: [] }];

  return (
    <div className="space-y-6">
      <StaffPageHeader eyebrow="Gradebook" title={String(doc.title || "Assessment")} />
      <p className="text-sm text-text-3">
        <Link href={`/staff/learning/courses/${courseId}?tab=assessments`} className="text-accent hover:underline">
          ← Assessments
        </Link>
      </p>
      <StaffPanel>
        <AssessmentEditor
          courseId={courseId}
          assessmentId={doc.id}
          moduleId={relationId(doc.module)}
          lessonId={relationId(doc.lesson)}
          moduleOptions={modules.docs.map((item) => ({ id: item.id, title: String(item.title) }))}
          lessonOptions={lessons.docs.map((item) => ({ id: item.id, title: String(item.title) }))}
          initial={{
            title: doc.title,
            slug: doc.slug,
            kind: doc.kind,
            instructions: doc.instructions,
            availableFrom: toDateTimeLocal(doc.availableFrom),
            dueAt: toDateTimeLocal(doc.dueAt),
            allowLate: Boolean(doc.allowLate),
            maxAttempts: doc.maxAttempts ?? 1,
            totalMarks: doc.totalMarks ?? 0,
            status: doc.status,
            questions: doc.questions,
            rubric: doc.rubric,
          }}
        />
      </StaffPanel>
      <StaffPanel>
        <StaffDeleteButton
          collection="lms-assessments"
          id={doc.id}
          redirectTo={`/staff/learning/courses/${courseId}?tab=assessments`}
        />
      </StaffPanel>
    </div>
  );
}
