import { BookOpen, ExternalLink, Users } from "@/components/ui/icons";
import type { MemberEnrollment } from "@/lib/lms";
import { Button } from "@/components/ui/Button";

export function LearningDashboard({ enrollments }: { enrollments: MemberEnrollment[] }) {
  if (!enrollments.length) return null;

  return (
    <section className="grid gap-4 md:grid-cols-2">
      {enrollments.map((enrollment) => {
        const isLive =
          Boolean(enrollment.classroomUrl) || /cohort|live/i.test(enrollment.programType || "");
        return (
          <article key={enrollment.id} className="rounded-2xl border border-white/10 bg-surface p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-baby-blue">
                {enrollment.programType === "Cohort" || isLive ? (
                  <Users className="h-5 w-5" />
                ) : (
                  <BookOpen className="h-5 w-5" />
                )}
              </div>
              <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-wide text-mint">
                {enrollment.status}
              </span>
            </div>
            <p className="mt-5 text-xs text-white/40">{enrollment.programType}</p>
            <h2 className="mt-1 font-display text-xl text-white">{enrollment.programName}</h2>
            {enrollment.classroomUrl ? (
              <div className="mt-5 rounded-xl border border-baby-blue/25 bg-baby-blue/10 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-baby-blue">Live class</p>
                <p className="mt-1 text-sm text-white/70">Join with your Google Classroom invite link.</p>
                <Button
                  href={enrollment.classroomUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 px-4 py-2 text-xs"
                >
                  Open Classroom <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : null}
            {enrollment.courseUrl ? (
              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  href={enrollment.courseUrl}
                  target="_blank"
                  rel="noreferrer"
                  variant="secondary"
                  className="px-4 py-2 text-xs"
                >
                  Open course <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : null}
          </article>
        );
      })}
    </section>
  );
}
