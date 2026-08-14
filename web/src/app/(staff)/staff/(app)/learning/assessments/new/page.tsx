import Link from "next/link";
import { AssessmentEditor } from "@/components/staff/AssessmentEditor";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { staffAccess } from "@/lib/staff/records";

export default async function NewAssessmentPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const staff = await requireStaff(["learning"], "/staff/learning");
  const params = await searchParams;
  const payload = await getPayloadClient();
  const access = staffAccess(staff);
  const courseId = params.course;
  if (!courseId) {
    return (
      <div className="space-y-6">
        <StaffPageHeader eyebrow="Learning" title="New assessment" hint="Open a course first." />
        <Link href="/staff/learning" className="text-sm text-baby-blue hover:underline">
          ← Learning
        </Link>
      </div>
    );
  }

  const [modules, lessons] = await Promise.all([
    payload.find({ collection: "lms-modules", depth: 0, limit: 200, where: { course: { equals: courseId } }, ...access }),
    payload.find({ collection: "lms-lessons", depth: 0, limit: 500, where: { course: { equals: courseId } }, ...access }),
  ]);

  return (
    <div className="space-y-6">
      <StaffPageHeader eyebrow="Gradebook" title="New assessment" hint="Quizzes auto-score multiple choice. Assignments use a rubric." />
      <p className="text-sm text-white/45">
        <Link href={`/staff/learning?course=${courseId}&tab=assessments`} className="text-baby-blue hover:underline">
          ← Assessments
        </Link>
      </p>
      <StaffPanel>
        <AssessmentEditor
          courseId={courseId}
          moduleOptions={modules.docs.map((item) => ({ id: item.id, title: String(item.title) }))}
          lessonOptions={lessons.docs.map((item) => ({ id: item.id, title: String(item.title) }))}
        />
      </StaffPanel>
    </div>
  );
}
