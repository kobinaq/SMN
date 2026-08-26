import Link from "next/link";
import { notFound } from "next/navigation";
import { GradeForm } from "@/components/staff/GradeForm";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { getCollectionDoc, relationId } from "@/lib/staff/records";

export default async function SubmissionGradePage({ params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaff(["learning", "support"], "/staff/learning");
  const { id } = await params;
  let submission;
  try {
    submission = await getCollectionDoc(await getPayloadClient(), staff, "lms-submissions", id, 1);
  } catch {
    notFound();
  }

  const assessment =
    submission.assessment && typeof submission.assessment === "object" ? submission.assessment : null;
  const member = submission.member && typeof submission.member === "object" ? submission.member : null;
  const courseId = relationId(submission.course);
  const answers = submission.answers && typeof submission.answers === "object" ? submission.answers : {};
  const rubric = (assessment?.rubric || []) as Array<{
    criterion?: string;
    description?: string | null;
    levels?: Array<{ label?: string; descriptor?: string | null; marks?: number | null }>;
  }>;

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Gradebook"
        title={String(assessment?.title || "Submission")}
        hint={`${member?.name || member?.email || "Learner"} · attempt ${submission.attemptNumber || 1}`}
      />
      <p className="text-sm text-text-3">
        <Link href={`/staff/learning/courses/${courseId}?tab=gradebook`} className="text-accent hover:underline">
          ← Gradebook
        </Link>
      </p>
      <StaffPanel>
        <p className="text-sm text-text-2 whitespace-pre-line">{assessment?.instructions}</p>
        {submission.textResponse ? (
          <div className="mt-4">
            <p className="text-xs uppercase tracking-wider text-text-3">Written response</p>
            <p className="mt-2 whitespace-pre-line text-sm text-text-2">{submission.textResponse}</p>
          </div>
        ) : null}
        {Object.keys(answers).length ? (
          <div className="mt-4 space-y-2">
            <p className="text-xs uppercase tracking-wider text-text-3">Answers</p>
            {Object.entries(answers as Record<string, unknown>).map(([key, value]) => (
              <p key={key} className="text-sm text-text-2">
                <span className="text-text-3">{key}:</span> {String(value)}
              </p>
            ))}
          </div>
        ) : null}
      </StaffPanel>
      <StaffPanel>
        <GradeForm
          submissionId={submission.id}
          courseId={courseId}
          maxScore={Number(submission.maxScore || assessment?.totalMarks || 0)}
          initialScore={typeof submission.score === "number" ? submission.score : null}
          initialFeedback={submission.feedback || ""}
          rubric={rubric.map((item) => ({
            criterion: item.criterion || "",
            description: item.description || "",
            levels: (item.levels || []).map((level) => ({
              label: level.label || "",
              descriptor: level.descriptor || "",
              marks: Number(level.marks || 0),
            })),
          }))}
        />
      </StaffPanel>
    </div>
  );
}
