import { BookOpen, ExternalLink, Users } from "@/components/ui/icons";
import type { MemberEnrollment } from "@/lib/lms";
import { Button } from "@/components/ui/Button";
import { Card, Eyebrow } from "@/components/ui/Surface";
import { Chip } from "@/components/ui/Chip";

export function LearningDashboard({ enrollments }: { enrollments: MemberEnrollment[] }) {
  if (!enrollments.length) return null;

  return (
    <section className="rise-stagger grid gap-3 md:grid-cols-2">
      {enrollments.map((enrollment, index) => {
        const isLive = Boolean(enrollment.classroomUrl) || /cohort|live/i.test(enrollment.programType || "");
        return (
          <Card key={enrollment.id} style={{ "--i": index } as React.CSSProperties}>
            <div className="flex items-start justify-between gap-4">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] ${
                  isLive ? "bg-ai-bg text-ai" : "bg-accent-bg text-accent"
                }`}
              >
                {isLive ? <Users className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
              </span>
              <Chip tone={enrollment.status === "completed" ? "ai" : "neutral"}>{enrollment.status}</Chip>
            </div>
            <Eyebrow tone="muted" className="mt-5">
              {enrollment.programType}
            </Eyebrow>
            <h2 className="mt-1 font-display text-lg text-text-1">{enrollment.programName}</h2>
            {enrollment.classroomUrl ? (
              <div className="mt-4 rounded-[var(--radius-md)] border border-ai/25 bg-ai-bg p-3.5">
                <p className="eyebrow text-ai">Live class</p>
                <p className="mt-1.5 text-sm text-text-2">Join with your Google Classroom invite link.</p>
                <Button href={enrollment.classroomUrl} target="_blank" rel="noreferrer" variant="ai" className="mt-3 px-4 py-2 text-xs">
                  Open Classroom <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : null}
            {enrollment.courseUrl ? (
              <div className="mt-4">
                <Button href={enrollment.courseUrl} target="_blank" rel="noreferrer" variant="secondary" className="px-4 py-2 text-xs">
                  Open course <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : null}
          </Card>
        );
      })}
    </section>
  );
}
