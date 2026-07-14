import Link from "next/link";
import { ArrowRight, BookOpen, Clock, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState, StatusBadge } from "@/components/ui/Feedback";
import { requireMember } from "@/lib/auth/member";
import { getLmsCourses } from "@/lib/lms";

export const metadata = { title: "Courses" };

function progressTone(percentage: number) {
  if (percentage >= 100) return "success" as const;
  if (percentage > 0) return "info" as const;
  return "neutral" as const;
}

export default async function LmsCoursesPage() {
  const member = await requireMember("/app/learning/courses");
  const courses = await getLmsCourses(member);

  return (
    <div className="space-y-7">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">LMS</p>
        <h1 className="mt-3 font-display text-2xl text-white sm:text-3xl">Courses</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">
          Structured SMN courses with unlisted YouTube lessons and downloadable files.
        </p>
      </div>

      {courses.length ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {courses.map((course) => (
            <article
              key={course.id}
              className="rounded-2xl border border-white/10 bg-surface p-5 transition hover:border-baby-blue/35"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-baby-blue/10 text-baby-blue">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <StatusBadge label={course.level} tone="neutral" />
                  <StatusBadge
                    label={course.percentage >= 100 ? "Completed" : course.percentage > 0 ? "In progress" : "Not started"}
                    tone={progressTone(course.percentage)}
                  />
                </div>
              </div>
              <h2 className="mt-5 font-display text-xl text-white">
                <Link href={course.href} className="hover:text-baby-blue">
                  {course.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/50">{course.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs text-white/40">
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1">
                  <PlayCircle className="h-3.5 w-3.5" />
                  {course.lessonCount} lessons
                </span>
                {course.estimatedHours ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1">
                    <Clock className="h-3.5 w-3.5" />
                    {course.estimatedHours}h
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1">
                  {course.completedCount}/{course.lessonCount} complete
                </span>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10" aria-hidden>
                <div className="h-full rounded-full bg-mint" style={{ width: `${course.percentage}%` }} />
              </div>
              <p className="mt-2 text-xs text-white/40">{course.percentage}% complete</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button href={course.continueHref}>
                  {course.percentage > 0 && course.percentage < 100 ? "Resume lesson" : course.percentage >= 100 ? "Review course" : "Start course"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
                <Button href={course.href} variant="secondary">
                  Overview
                </Button>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <EmptyState
          title="No courses unlocked yet"
          description="Staff can grant course access through enrollments. Once a course is published and tied to your program key, it will show here."
          action={
            <>
              <Button href="/app/learning">Back to learning</Button>
              <Button href="/programs/courses" variant="secondary">
                Browse public courses
              </Button>
            </>
          }
        />
      )}
    </div>
  );
}
