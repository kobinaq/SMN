import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Circle, Clock, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Feedback";
import { requireMember } from "@/lib/auth/member";
import { getLmsCourse } from "@/lib/lms";

export const metadata = { title: "Course" };

export default async function LmsCoursePage(props: { params: Promise<{ courseSlug: string }> }) {
  const { courseSlug } = await props.params;
  const member = await requireMember(`/app/learning/courses/${courseSlug}`);
  const course = await getLmsCourse(member, courseSlug);
  if (!course) notFound();

  return (
    <div className="space-y-7">
      <div>
        <Link href="/app/learning/courses" className="text-sm text-white/45 transition hover:text-white">
          Courses
        </Link>
        <div className="mt-5 flex flex-wrap gap-2">
          <StatusBadge label={course.level} />
          {course.category ? <StatusBadge label={course.category} tone="info" /> : null}
          {course.certificateEnabled ? <StatusBadge label="Certificate available" tone="success" /> : null}
        </div>
        <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">{course.programKey}</p>
        <h1 className="mt-3 font-display text-2xl text-white sm:text-3xl">{course.title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">{course.summary}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/45">
          {course.instructor ? <span>Instructor · {course.instructor}</span> : null}
          <span>
            {course.modules.length} modules · {course.lessonCount} lessons
            {course.estimatedHours ? ` · ${course.estimatedHours}h` : ""}
          </span>
        </div>
        <div className="mt-6">
          <Button href={course.continueHref}>
            {course.percentage > 0 && course.percentage < 100
              ? "Resume lesson"
              : course.percentage >= 100
                ? "Review course"
                : "Start course"}
          </Button>
        </div>
      </div>

      <section className="rounded-2xl border border-white/10 bg-ink p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-baby-blue">Course progress</p>
            <p className="mt-2 font-display text-2xl text-white">
              {course.completedCount} of {course.lessonCount} lessons complete
            </p>
          </div>
          <strong className="text-3xl text-mint">{course.percentage}%</strong>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-mint" style={{ width: `${course.percentage}%` }} />
        </div>
      </section>

      {(course.learningOutcomes.length || course.prerequisites) && (
        <section className="grid gap-4 lg:grid-cols-2">
          {course.learningOutcomes.length ? (
            <div className="rounded-2xl border border-white/10 bg-surface p-5">
              <h2 className="font-display text-lg text-white">Learning outcomes</h2>
              <ul className="mt-3 space-y-2 text-sm text-white/55">
                {course.learningOutcomes.map((outcome) => (
                  <li key={outcome}>• {outcome}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {course.prerequisites ? (
            <div className="rounded-2xl border border-white/10 bg-surface p-5">
              <h2 className="font-display text-lg text-white">Prerequisites</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-white/55">{course.prerequisites}</p>
            </div>
          ) : null}
        </section>
      )}

      <div className="space-y-6">
        {course.modules.map((module) => (
          <section key={module.id}>
            <div className="mb-3">
              <h2 className="font-display text-xl text-white">{module.title}</h2>
              {module.summary ? <p className="mt-1 text-sm text-white/45">{module.summary}</p> : null}
            </div>
            <div className="space-y-2">
              {module.lessons.map((lesson) => {
                const completed = lesson.status === "completed";
                return (
                  <Link
                    key={lesson.id}
                    href={lesson.href}
                    className="grid gap-4 rounded-2xl border border-white/10 bg-surface p-4 transition hover:border-baby-blue/35 sm:grid-cols-[auto_1fr_auto] sm:items-center"
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                        completed ? "border-mint/40 bg-mint/10 text-mint" : "border-white/15 text-white/40"
                      }`}
                    >
                      {completed ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                    </span>
                    <span>
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-base text-white">{lesson.title}</span>
                        <span className="text-[10px] uppercase tracking-wide text-baby-blue">{lesson.lessonType}</span>
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-white/45">{lesson.summary}</span>
                    </span>
                    <span className="inline-flex items-center gap-2 text-xs text-white/35">
                      {lesson.lessonType === "video" ? (
                        <PlayCircle className="h-3.5 w-3.5" />
                      ) : (
                        <Clock className="h-3.5 w-3.5" />
                      )}
                      {lesson.durationMinutes ? `${lesson.durationMinutes} min` : "Open"}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
