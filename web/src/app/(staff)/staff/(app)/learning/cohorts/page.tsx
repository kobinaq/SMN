import { Plus } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import { CourseIndex } from "@/components/staff/CourseIndex";
import { StaffDataFailure } from "@/components/staff/StaffDataFailure";
import { StaffMetricGrid, StaffPageHeader } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { loadCourseSummaries } from "@/lib/staff/learning-index";

export const metadata = { title: "Cohorts" };

export default async function StaffCohortsPage() {
  const staff = await requireStaff(["learning", "content", "support"], "/staff/learning/cohorts");
  const payload = await getPayloadClient();
  const loaded = await loadCourseSummaries(payload, staff);

  const header = (
    <StaffPageHeader
      eyebrow="Learning"
      title="Cohorts"
      hint="Live intakes with a start date, seats and a session plan."
    >
      <Button href="/staff/learning/cohorts/new">
        <Plus className="h-4 w-4" />
        New cohort
      </Button>
    </StaffPageHeader>
  );

  if (loaded.failure) {
    return (
      <div className="space-y-6">
        {header}
        <StaffDataFailure failure={loaded.failure} />
      </div>
    );
  }

  const cohorts = loaded.summaries.filter((course) => course.delivery === "cohort");
  const published = cohorts.filter((course) => course.status === "published").length;
  const drafts = cohorts.filter((course) => course.status === "draft").length;
  const learners = cohorts.reduce((total, course) => total + course.learnerCount, 0);

  return (
    <div className="space-y-6">
      {header}

      {cohorts.length ? (
        <StaffMetricGrid
          items={[
            { label: "Published", value: published, tone: "ai" },
            { label: "Drafts", value: drafts, tone: "warn" },
            { label: "Enrolled learners", value: learners, tone: "accent" },
          ]}
        />
      ) : null}

      <CourseIndex
        courses={cohorts}
        newHref="/staff/learning/cohorts/new"
        newLabel="New cohort"
        emptyTitle="No cohorts yet"
        emptyDescription="Create a live intake — a start date, seats and a session plan. You can market it before adding any learning materials."
        warnOnOpen={{
          title: "Edit this cohort?",
          description:
            "This cohort may be live on the public site and have learners enrolled. Changes to its dates, seats, fee or details update what applicants see and can affect enrolled learners. Continue to edit it?",
        }}
      />
    </div>
  );
}
