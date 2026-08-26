import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Surface";
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
        <Link href={data.href} className="text-sm text-text-3 transition-colors hover:text-text-1">
          {data.courseTitle}
        </Link>
        <h1 className="mt-3 font-display text-2xl text-text-1 sm:text-3xl">Grades</h1>
        <p className="mt-2 text-sm text-text-2">Scores, due dates, and remaining attempts for this course.</p>
      </div>
      <div className="rise-stagger space-y-3">
        {data.assessments.length ? (
          data.assessments.map((item, index) => (
            <Card key={String(item.id)} href={assessmentHref(courseSlug, item.id)} style={{ "--i": index } as React.CSSProperties}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="eyebrow text-accent">{item.kind}</p>
                  <h2 className="mt-1 font-display text-lg text-text-1">{item.title}</h2>
                  <p className="tnum mt-2 text-xs text-text-3">
                    {item.dueAt
                      ? `Due ${new Date(item.dueAt).toLocaleString("en-GH", { dateStyle: "medium", timeStyle: "short" })}`
                      : "No due date"}
                    {item.maxAttempts ? ` · ${item.remaining} attempt${item.remaining === 1 ? "" : "s"} left` : ""}
                  </p>
                </div>
                <p className="tnum text-sm text-ai">
                  {item.latest && item.latest.score != null
                    ? `${item.latest.score}/${item.latest.maxScore ?? item.totalMarks}`
                    : item.latest
                      ? item.latest.status
                      : "Not submitted"}
                </p>
              </div>
              {item.latest?.feedback ? <p className="mt-3 text-sm text-text-2">{item.latest.feedback}</p> : null}
            </Card>
          ))
        ) : (
          <Card className="border-dashed text-center text-sm text-text-3">No assessments published yet.</Card>
        )}
      </div>
    </div>
  );
}
