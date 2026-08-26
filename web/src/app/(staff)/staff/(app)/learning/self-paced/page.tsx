import { Plus } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import { CourseIndex } from "@/components/staff/CourseIndex";
import { StaffDataFailure } from "@/components/staff/StaffDataFailure";
import { StaffMetricGrid, StaffPageHeader } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { loadCourseSummaries } from "@/lib/staff/learning-index";

export const metadata = { title: "Self-paced courses" };

export default async function StaffSelfPacedPage() {
  const staff = await requireStaff(["learning", "content", "support"], "/staff/learning/self-paced");
  const payload = await getPayloadClient();
  const loaded = await loadCourseSummaries(payload, staff);

  const header = (
    <StaffPageHeader
      eyebrow="Learning"
      title="Self-paced courses"
      hint="Courses members work through on their own — modules, lessons and assessments inside SMN."
    >
      <Button href="/staff/learning/courses/new">
        <Plus className="h-4 w-4" />
        New course
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

  const courses = loaded.summaries.filter((course) => course.delivery === "self-paced");
  const published = courses.filter((course) => course.status === "published").length;
  const drafts = courses.filter((course) => course.status === "draft").length;
  const learners = courses.reduce((total, course) => total + course.learnerCount, 0);

  return (
    <div className="space-y-6">
      {header}

      {courses.length ? (
        <StaffMetricGrid
          items={[
            { label: "Published", value: published, tone: "ai" },
            { label: "Drafts", value: drafts, tone: "warn" },
            { label: "Enrolled learners", value: learners, tone: "accent" },
          ]}
        />
      ) : null}

      <CourseIndex
        courses={courses}
        newHref="/staff/learning/courses/new"
        newLabel="New course"
        emptyTitle="No self-paced courses yet"
        emptyDescription="Create a course members work through on their own — modules, lessons and assessments inside SMN."
      />
    </div>
  );
}
