import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, Clock, PlayCircle, Users } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import { Card, PageHeader, ProgressBar } from "@/components/ui/Surface";
import { Chip } from "@/components/ui/Chip";
import { requireMember } from "@/lib/auth/member";
import { getLmsCourses } from "@/lib/lms";

export const metadata = { title: "Courses" };

export default async function LmsCoursesPage() {
  const member = await requireMember("/app/learning/courses");
  const courses = await getLmsCourses(member);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="LMS"
        title="Courses"
        description="Self-paced courses and live cohort workspaces you have unlocked."
      />

      {courses.length ? (
        <section className="rise-stagger grid gap-4 lg:grid-cols-2">
          {courses.map((course, index) => {
            const isCohort = course.delivery === "cohort";
            return (
              <Card key={course.id} style={{ "--i": index } as React.CSSProperties}>
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-[var(--radius-lg)] ${
                      isCohort ? "bg-ai-bg text-ai" : "bg-accent-bg text-accent"
                    }`}
                  >
                    {isCohort ? <Users className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
                  </span>
                  <div className="flex flex-wrap justify-end gap-2">
                    <Chip tone={isCohort ? "ai" : "accent"}>{isCohort ? "Live cohort" : "Self-paced"}</Chip>
                    <Chip
                      tone={course.percentage >= 100 ? "ai" : course.percentage > 0 ? "accent" : "neutral"}
                    >
                      {course.percentage >= 100 ? "Completed" : course.percentage > 0 ? "In progress" : "Not started"}
                    </Chip>
                  </div>
                </div>

                <h2 className="mt-5 font-display text-xl text-text-1">
                  <Link href={course.href} className="transition-colors hover:text-accent">
                    {course.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-text-2">{course.summary}</p>

                {isCohort ? (
                  <>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {course.startDate ? (
                        <Chip tone="neutral" icon={<CalendarDays className="h-3.5 w-3.5" />}>
                          {course.startDate}
                        </Chip>
                      ) : null}
                      {course.duration ? (
                        <Chip tone="neutral" icon={<Clock className="h-3.5 w-3.5" />}>
                          {course.duration}
                        </Chip>
                      ) : null}
                      {course.sessionsNote ? <Chip tone="neutral">{course.sessionsNote}</Chip> : null}
                    </div>
                    <div className="mt-5">
                      <Button href={course.href} variant="ai">
                        Open workspace
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Chip tone="neutral" icon={<PlayCircle className="h-3.5 w-3.5" />}>
                        {course.lessonCount} lessons
                      </Chip>
                      {course.estimatedHours ? (
                        <Chip tone="neutral" icon={<Clock className="h-3.5 w-3.5" />}>
                          {course.estimatedHours}h
                        </Chip>
                      ) : null}
                      <Chip tone="neutral">
                        {course.completedCount}/{course.lessonCount} complete
                      </Chip>
                    </div>
                    <ProgressBar value={course.percentage} className="mt-5" label={`${course.title} progress`} />
                    <p className="tnum mt-2 text-xs text-text-3">{course.percentage}% complete</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button href={course.continueHref}>
                        {course.percentage > 0 && course.percentage < 100
                          ? "Resume lesson"
                          : course.percentage >= 100
                            ? "Review course"
                            : "Start course"}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                      <Button href={course.href} variant="secondary">
                        Overview
                      </Button>
                    </div>
                  </>
                )}
              </Card>
            );
          })}
        </section>
      ) : (
        <Card className="border-dashed px-6 py-10 text-center">
          <p className="font-display text-lg text-text-1">No courses unlocked yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-2">
            Staff can grant course access through enrollments. Once a course is published and tied to your program
            key, it will show here.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button href="/app/learning">Back to learning</Button>
            <Button href="/programs/courses" variant="secondary">
              Browse public courses
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
