import Link from "next/link";
import { BookOpen, Users } from "@/components/ui/icons";
import { Card } from "@/components/ui/Surface";
import { StaffDataFailure } from "@/components/staff/StaffDataFailure";
import { StaffMetricGrid, StaffPageHeader } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { loadCourseSummaries } from "@/lib/staff/learning-index";

export const metadata = { title: "Learning" };

export default async function StaffLearningHubPage() {
  const staff = await requireStaff(["learning", "content", "support"], "/staff/learning");
  const payload = await getPayloadClient();
  const loaded = await loadCourseSummaries(payload, staff);

  const header = (
    <StaffPageHeader
      eyebrow="Work"
      title="Learning"
      hint="Self-paced courses and live cohorts, each with its own workspace."
    />
  );

  if (loaded.failure) {
    return (
      <div className="space-y-6">
        {header}
        <StaffDataFailure failure={loaded.failure} />
      </div>
    );
  }

  const summaries = loaded.summaries;
  const selfPaced = summaries.filter((course) => course.delivery === "self-paced");
  const cohorts = summaries.filter((course) => course.delivery === "cohort");
  const published = summaries.filter((course) => course.status === "published").length;
  const learners = summaries.reduce((total, course) => total + course.learnerCount, 0);

  const lanes = [
    {
      href: "/staff/learning/self-paced",
      icon: BookOpen,
      tone: "accent" as const,
      title: "Self-paced courses",
      body: "Courses members work through on their own — modules, lessons and assessments inside SMN.",
      count: selfPaced.length,
      unit: selfPaced.length === 1 ? "course" : "courses",
    },
    {
      href: "/staff/learning/cohorts",
      icon: Users,
      tone: "ai" as const,
      title: "Cohorts",
      body: "Live intakes with a start date, seats and a session plan. Market them first; add materials later.",
      count: cohorts.length,
      unit: cohorts.length === 1 ? "cohort" : "cohorts",
    },
  ];

  return (
    <div className="space-y-6">
      {header}

      {summaries.length ? (
        <StaffMetricGrid
          items={[
            { label: "Self-paced", value: selfPaced.length, tone: "accent" },
            { label: "Cohorts", value: cohorts.length, tone: "ai" },
            { label: "Published", value: published, tone: "ai" },
            { label: "Enrolled learners", value: learners, tone: "accent" },
          ]}
        />
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        {lanes.map((lane) => (
          <Link key={lane.href} href={lane.href} className="group block">
            <Card className="flex h-full flex-col transition-colors group-hover:border-edge-strong">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] ${
                  lane.tone === "ai" ? "bg-ai-bg text-ai" : "bg-accent-bg text-accent"
                }`}
              >
                <lane.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-xl text-text-1 transition-colors group-hover:text-accent">
                {lane.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-text-2">{lane.body}</p>
              <p className="tnum mt-4 text-xs text-text-3">
                {lane.count} {lane.unit}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
