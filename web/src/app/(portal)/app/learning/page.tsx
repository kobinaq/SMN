import Link from "next/link";
import { LearningDashboard } from "@/components/app/LearningDashboard";
import { Button } from "@/components/ui/Button";
import { requireMember } from "@/lib/auth/member";
import { getLearningDashboard } from "@/lib/learning";
import { site } from "@/lib/site";

export const metadata = { title: "Learning" };

export default async function LearningPage() {
  const member = await requireMember("/app/learning");
  const dashboard = await getLearningDashboard(member);
  const hasAccess = dashboard.enrollments.length || dashboard.items.length;

  return (
    <div className="space-y-7">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">
          Learning
        </p>
        <h1 className="mt-3 font-display text-2xl text-white sm:text-3xl">Your learning home</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">
          Courses, Classroom links, Selar access, resources, and weekly milestones organized around
          the programs you have unlocked.
        </p>
        <div className="btn-row-mobile mt-5">
          <Button href="/app/learning/courses">Open courses</Button>
        </div>
      </div>

      {hasAccess ? (
        <LearningDashboard initialItems={dashboard.items} enrollments={dashboard.enrollments} />
      ) : (
        <div className="rounded-2xl border border-dashed border-white/15 bg-surface p-6 sm:p-8">
          <p className="font-display text-lg text-white">Nothing unlocked yet</p>
          <p className="mt-2 max-w-xl text-sm text-white/50">
            Staff grants access when you join a cohort or confirm a Selar purchase. Your links and
            learning checklist will appear here.
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
