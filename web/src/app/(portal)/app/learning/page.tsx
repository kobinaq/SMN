import Link from "next/link";
import { LearningDashboard } from "@/components/app/LearningDashboard";
import { PaymentSuccessBeacon } from "@/components/payments/PaymentSuccessBeacon";
import { Button } from "@/components/ui/Button";
import { requireMember } from "@/lib/auth/member";
import { getLearningDashboard } from "@/lib/learning";
import { getLmsCourses } from "@/lib/lms";
import { getPayloadClient } from "@/lib/payload";
import { fulfillSuccessfulPayment } from "@/lib/payments/fulfill";
import { paystackConfigured, paystackVerify } from "@/lib/payments/paystack";
import { site } from "@/lib/site";

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

  const [dashboard, lmsCourses] = await Promise.all([
    getLearningDashboard(member),
    getLmsCourses(member).catch(() => []),
  ]);
  const hasAccess = dashboard.enrollments.length || dashboard.items.length;
  const resumeCourse = lmsCourses.find((course) => course.percentage > 0 && course.percentage < 100);

  return (
    <div className="space-y-7">
      {params.reference ? <PaymentSuccessBeacon kind="course" reference={params.reference} /> : null}
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">
          Learning
        </p>
        <h1 className="mt-3 font-display text-2xl text-white sm:text-3xl">Your learning home</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">
          Courses, Classroom links, resources, and weekly milestones organized around the programs
          you have unlocked.
        </p>
        {resumeCourse ? (
          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-baby-blue/30 bg-gradient-to-br from-baby-blue/10 to-surface p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">
                Pick up where you left off
              </p>
              <p className="mt-1 truncate font-display text-lg text-white">{resumeCourse.title}</p>
              <p className="mt-0.5 text-sm text-white/50">
                {resumeCourse.percentage}% complete · {resumeCourse.completedCount}/
                {resumeCourse.lessonCount} lessons
              </p>
            </div>
            <Button href={resumeCourse.continueHref} className="shrink-0">
              Resume lesson
            </Button>
          </div>
        ) : null}
        <div className="btn-row-mobile mt-5">
          <Button href="/app/learning/courses" variant={resumeCourse ? "secondary" : "primary"}>
            Open courses
          </Button>
        </div>
      </div>

      {hasAccess ? (
        <LearningDashboard initialItems={dashboard.items} enrollments={dashboard.enrollments} />
      ) : (
        <div className="rounded-2xl border border-dashed border-white/15 bg-surface p-6 sm:p-8">
          <p className="font-display text-lg text-white">Nothing unlocked yet</p>
          <p className="mt-2 max-w-xl text-sm text-white/50">
            Access unlocks when you join a cohort or complete a catalogue purchase. Your Classroom
            links and learning checklist will appear here.
          </p>
          <div className="btn-row-mobile mt-6">
            <Button href="/programs/cohort">Flagship cohort</Button>
            <Button href="/programs/courses" variant="secondary">
              Self-paced courses
            </Button>
          </div>
        </div>
      )}

      <p className="text-sm text-white/40">
        Next intake: {site.cohort.startDate}.{" "}
        <Link href="/apply" className="text-baby-blue hover:text-white">
          Apply
        </Link>
      </p>
    </div>
  );
}
