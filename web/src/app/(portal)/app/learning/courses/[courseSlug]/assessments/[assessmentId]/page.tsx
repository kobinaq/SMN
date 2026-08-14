import Link from "next/link";
import { notFound } from "next/navigation";
import { LearnerAssessmentForm } from "@/components/app/LearnerAssessmentForm";
import { requireMember } from "@/lib/auth/member";
import { getMemberCourseAssessments } from "@/lib/lms-assess";

export const metadata = { title: "Assessment" };

export default async function CourseAssessmentPage(props: {
  params: Promise<{ courseSlug: string; assessmentId: string }>;
}) {
  const { courseSlug, assessmentId } = await props.params;
  const member = await requireMember(`/app/learning/courses/${courseSlug}/assessments/${assessmentId}`);
  const data = await getMemberCourseAssessments(member, courseSlug);
  const assessment = data?.assessments.find((item) => String(item.id) === String(assessmentId));
  if (!data || !assessment) notFound();

  return (
    <div className="space-y-7">
      <div>
        <Link href={`/app/learning/courses/${courseSlug}/grades`} className="text-sm text-white/45 hover:text-white">
          Grades
        </Link>
        <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">{assessment.kind}</p>
        <h1 className="mt-3 font-display text-2xl text-white sm:text-3xl">{assessment.title}</h1>
        <p className="mt-2 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-white/55">
          {assessment.instructions}
        </p>
        <p className="mt-3 text-xs text-white/40">
          {assessment.dueAt
            ? `Due ${new Date(assessment.dueAt).toLocaleString("en-GH", { dateStyle: "medium", timeStyle: "short" })}`
            : "No due date"}
          {assessment.maxAttempts ? ` · ${assessment.remaining} attempts left` : ""}
          {assessment.latest && assessment.latest.score != null
            ? ` · Latest score ${assessment.latest.score}/${assessment.latest.maxScore ?? assessment.totalMarks}`
            : ""}
        </p>
      </div>
      {assessment.latest?.feedback ? (
        <section className="rounded-2xl border border-mint/25 bg-mint/5 p-5 text-sm text-white/70">
          <p className="text-xs uppercase tracking-wider text-mint">Feedback</p>
          <p className="mt-2 whitespace-pre-line">{assessment.latest.feedback}</p>
        </section>
      ) : null}
      <LearnerAssessmentForm assessment={assessment} courseSlug={courseSlug} />
    </div>
  );
}
