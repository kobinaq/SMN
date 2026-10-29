import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { pageTitle } from "@/lib/brand";
import { CreateCohortForm } from "./CreateCohortForm";

export const metadata = { title: pageTitle("New cohort", { staff: true }) };

export default async function StaffNewCohortPage() {
  await requireStaff(["learning", "content"], "/staff/learning/cohorts/new");

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Cohorts"
        title="New cohort"
        description="Enter what the public site needs to market this intake. Session plan, Classroom link and curriculum come later from the workspace."
        action={{ href: "/staff/learning/cohorts", label: "All cohorts" }}
      />
      <StaffPanel className="max-w-2xl">
        <CreateCohortForm />
      </StaffPanel>
    </div>
  );
}
