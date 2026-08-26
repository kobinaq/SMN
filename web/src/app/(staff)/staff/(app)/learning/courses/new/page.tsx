import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { isAIFeatureEnabled } from "@/lib/ai/config";
import { requireStaff } from "@/lib/auth/staff";
import { CreateCourseForm } from "./CreateCourseForm";

export default async function StaffNewCoursePage() {
  await requireStaff(["learning", "content"], "/staff/learning/courses/new");
  const aiEnabled = isAIFeatureEnabled("content-studio");

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Self-paced courses"
        title="New course"
        description="Create a blank draft, or let the SMN AI assistant draft the course, modules, and lessons for you to refine."
        action={{ href: "/staff/learning/self-paced", label: "All courses" }}
      />
      <StaffPanel className="max-w-2xl">
        <CreateCourseForm aiEnabled={aiEnabled} />
      </StaffPanel>
    </div>
  );
}
