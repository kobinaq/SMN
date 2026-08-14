import Link from "next/link";
import { notFound } from "next/navigation";
import { requireMember } from "@/lib/auth/member";
import { assessmentHref, getMemberCourseAssessments } from "@/lib/lms-assess";

export const metadata = { title: "Grades" };

export default async function CourseGradesPage(props: { params: Promise<{ courseSlug: string }> }) {
  const { courseSlug } = await props.params;
  const member = await requireMember(`/app/learning/courses/${courseSlug}/grades`);
  const data = await getMemberCourseAssessments(member, courseSlug);
  if (!data) notFound();

  return (
    <div className="space-y-7">
      <div>
        <Link href={data.href} className="text-sm text-white/45 transition hover:text-white">
          {data.courseTitle}
        </Link>
        <h1 className="mt-3 font-display text-2xl text-white sm:text-3xl">Grades</h1>
        <p className="mt-2 text-sm text-white/55">Scores, due dates, and remaining attempts for this course.</p>
      </div>
      <div className="space-y-3">
        {data.assessments.length ? (
          data.assessments.map((item) => (
            <Link
              key={String(item.id)}
              href={assessmentHref(courseSlug, item.id)}
              className="block rounded-2xl border border-white/10 bg-surface p-5 transition hover:border-baby-blue/35"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-baby-blue">{item.kind}</p>
                  <h2 className="mt-1 font-display text-lg text-white">{item.title}</h2>
                  <p className="mt-2 text-xs text-white/45">
                    {item.dueAt
                      ? `Due ${new Date(item.dueAt).toLocaleString("en-GH", { dateStyle: "medium", timeStyle: "short" })}`
                      : "No due date"}
                    {item.maxAttempts ? ` · ${item.remaining} attempt${item.remaining === 1 ? "" : "s"} left` : ""}
                  </p>
                </div>
                <p className="text-sm text-mint">
                  {item.latest && item.latest.score != null
                    ? `${item.latest.score}/${item.latest.maxScore ?? item.totalMarks}`
                    : item.latest
                      ? item.latest.status
                      : "Not submitted"}
                </p>
              </div>
              {item.latest?.feedback ? (
                <p className="mt-3 text-sm text-white/55">{item.latest.feedback}</p>
              ) : null}
            </Link>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-white/15 px-4 py-8 text-center text-sm text-white/45">
            No assessments published yet.
          </p>
        )}
      </div>
    </div>
  );
}
