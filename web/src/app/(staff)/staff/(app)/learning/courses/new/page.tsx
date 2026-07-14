import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { CreateCourseForm } from "./CreateCourseForm";

export default async function StaffNewCoursePage() {
  await requireStaff(["learning", "content"], "/staff/learning/courses/new");

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Learning operations"
        title="New course"
        description="Create a draft LMS course. Curriculum and publishing happen in Course Builder."
        action={{ href: "/staff/learning", label: "Back to courses" }}
      />
      <StaffPanel className="max-w-xl">
        <CreateCourseForm />
      </StaffPanel>
    </div>
  );
}
