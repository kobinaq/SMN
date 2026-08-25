import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, Users } from "@/components/ui/icons";
import { LearningDashboard } from "@/components/app/LearningDashboard";
import { PaymentSuccessBeacon } from "@/components/payments/PaymentSuccessBeacon";
import { Button } from "@/components/ui/Button";
import { Card, Eyebrow, PageHeader, ProgressBar, Stat } from "@/components/ui/Surface";
import { requireMember } from "@/lib/auth/member";
import { getLmsCourses, getMemberEnrollments } from "@/lib/lms";
import { getPayloadClient } from "@/lib/payload";
import { fulfillSuccessfulPayment } from "@/lib/payments/fulfill";
import { paystackConfigured, paystackVerify } from "@/lib/payments/paystack";
import { getSiteSettings } from "@/lib/cms";

export const metadata = { title: "Learning" };

type Props = { searchParams: Promise<{ reference?: string }> };

export default async function LearningPage({ searchParams }: Props) {
  const member = await requireMember("/app/learning");
  const params = await searchParams;

  if (params.reference && paystackConfigured()) {
    try {
      const payload = await getPayloadClient();
      const verified = await paystackVerify(params.reference);
      if (verified.status === "success") {
        await fulfillSuccessfulPayment(payload, params.reference);
      }
    } catch {
      /* soft-fail; dashboard still loads */
    }
  }

  const [enrollments, lmsCourses, settings] = await Promise.all([
    getMemberEnrollments(member).catch(() => []),
    getLmsCourses(member).catch(() => []),
    getSiteSettings(),
  ]);

  const hasAccess = enrollments.length > 0 || lmsCourses.length > 0;
  const resumeCourse = lmsCourses.find(
    (course) => course.delivery !== "cohort" && course.percentage > 0 && course.percentage < 100,
  );
  const cohorts = lmsCourses.filter((course) => course.delivery === "cohort");
  const selfPaced = lmsCourses.filter((course) => course.delivery !== "cohort");
  const completed = lmsCourses.filter((course) => course.percentage >= 100).length;

  return (
    <div className="space-y-8">
      {params.reference ? <PaymentSuccessBeacon kind="course" reference={params.reference} /> : null}

      <PageHeader
        eyebrow="Learning"
        title="Your learning home"
        description="Self-paced courses and live cohort workspaces for the programmes you have unlocked."
        action={
          <Button href="/app/learning/courses" variant={resumeCourse ? "secondary" : "primary"}>
            Open courses
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        }
      />

      {/* Continuity first: the single most likely next action goes above everything else. */}
      {resumeCourse ? (
        <Card
          href={resumeCourse.continueHref}
          className="rise border-accent/25 bg-gradient-to-br from-accent-bg to-raised"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <Eyebrow>Pick up where you left off</Eyebrow>
              <p className="mt-2 truncate font-display text-xl text-text-1">{resumeCourse.title}</p>
              <p className="tnum mt-1 text-sm text-text-2">
                {resumeCourse.percentage}% complete · {resumeCourse.completedCount}/{resumeCourse.lessonCount} lessons
              </p>
              <ProgressBar
                value={resumeCourse.percentage}
                className="mt-3 max-w-sm"
                label={`${resumeCourse.title} progress`}
              />
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent-strong px-5 py-2.5 text-sm font-semibold text-[#08111f]">
              Resume lesson
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </Card>
      ) : null}

      {hasAccess ? (
        <>
          <section className="rise-stagger grid gap-3 sm:grid-cols-3">
            <div style={{ "--i": 0 } as React.CSSProperties}>
              <Stat label="Courses in progress" value={selfPaced.filter((c) => c.percentage > 0 && c.percentage < 100).length} />
            </div>
            <div style={{ "--i": 1 } as React.CSSProperties}>
              <Stat label="Live cohorts" value={cohorts.length} tone="ai" />
            </div>
            <div style={{ "--i": 2 } as React.CSSProperties}>
              <Stat label="Completed" value={completed} tone="accent" />
            </div>
          </section>

          {lmsCourses.length ? (
            <section className="space-y-3">
              <div className="flex items-end justify-between gap-3">
                <h2 className="font-display text-xl text-text-1">Your programmes</h2>
                <Link href="/app/learning/courses" className="text-sm text-accent hover:underline">
                  View all
                </Link>
              </div>
              <div className="rise-stagger grid gap-3 sm:grid-cols-2">
                {lmsCourses.slice(0, 4).map((course, index) => {
                  const isCohort = course.delivery === "cohort";
                  return (
                    <Card
                      key={course.id}
                      href={isCohort ? course.href : course.continueHref}
                      style={{ "--i": index } as React.CSSProperties}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] ${
                            isCohort ? "bg-ai-bg text-ai" : "bg-accent-bg text-accent"
                          }`}
                        >
                          {isCohort ? <Users className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            isCohort ? "bg-ai-bg text-ai" : "bg-accent-bg text-accent"
                          }`}
                        >
                          {isCohort ? "Live cohort" : "Self-paced"}
                        </span>
                      </div>
                      <h3 className="mt-4 font-display text-lg text-text-1">{course.title}</h3>
                      {isCohort ? (
                        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-text-2">
                          <CalendarDays className="h-3.5 w-3.5 text-ai" />
                          {course.startDate || course.duration || "Schedule in your workspace"}
                        </p>
                      ) : (
                        <>
                          <p className="tnum mt-1.5 text-sm text-text-2">
                            {course.completedCount}/{course.lessonCount} lessons · {course.percentage}%
                          </p>
                          <ProgressBar value={course.percentage} className="mt-3" label={`${course.title} progress`} />
                        </>
                      )}
                    </Card>
                  );
                })}
              </div>
            </section>
          ) : null}

          <LearningDashboard enrollments={enrollments} />
        </>
      ) : (
        <Card className="border-dashed px-6 py-10 text-center">
          <p className="font-display text-lg text-text-1">Nothing unlocked yet</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-2">
            Access unlocks when staff grant enrollment or you complete a purchase. Your courses and live cohort
            workspaces will appear here.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button href="/programs/cohort">Flagship cohort</Button>
            <Button href="/programs/courses" variant="secondary">
              Self-paced courses
            </Button>
          </div>
        </Card>
      )}

      <p className="text-sm text-text-3">
        Next intake: {settings.cohort.startDate}.{" "}
        <Link href="/apply" className="text-accent hover:underline">
          Apply
        </Link>
      </p>
    </div>
  );
}
