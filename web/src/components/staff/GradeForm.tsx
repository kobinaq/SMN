"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { staffFieldClass, StaffFormField } from "@/components/staff/ui";

type Criterion = {
  criterion: string;
  description: string;
  levels: Array<{ label: string; descriptor: string; marks: number }>;
};

export function GradeForm({
  submissionId,
  courseId,
  maxScore,
  rubric,
  initialScore,
  initialFeedback,
}: {
  submissionId: string | number;
  courseId: string | number;
  maxScore: number;
  rubric: Criterion[];
  initialScore?: number | null;
  initialFeedback?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [marks, setMarks] = useState<Record<string, string>>(() => {
    const next: Record<string, string> = {};
    for (const item of rubric) next[item.criterion] = "";
    return next;
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const rubricScores = rubric.map((item) => ({
      criterion: item.criterion,
      marks: Number(marks[item.criterion] || 0),
      comment: "",
    }));
    try {
      const response = await fetch("/api/staff/grade", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          submissionId,
          score: form.get("score") === "" ? undefined : Number(form.get("score")),
          feedback: String(form.get("feedback") || ""),
          status: String(form.get("status") || "graded"),
          rubricScores,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to save grade.");
      router.push(`/staff/learning?course=${courseId}&tab=gradebook`);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save grade.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {rubric.map((item) => (
        <StaffFormField key={item.criterion} label={`${item.criterion} (max ${Math.max(0, ...item.levels.map((level) => level.marks))})`}>
          <input
            className={staffFieldClass}
            type="number"
            min={0}
            value={marks[item.criterion] || ""}
            onChange={(event) => setMarks((current) => ({ ...current, [item.criterion]: event.target.value }))}
          />
        </StaffFormField>
      ))}
      <StaffFormField label={`Score (max ${maxScore || "—"})`}>
        <input className={staffFieldClass} name="score" type="number" min={0} defaultValue={initialScore ?? ""} />
      </StaffFormField>
      <StaffFormField label="Feedback">
        <textarea className={staffFieldClass} name="feedback" rows={5} defaultValue={initialFeedback || ""} />
      </StaffFormField>
      <StaffFormField label="Status">
        <select className={staffFieldClass} name="status" defaultValue="graded">
          <option value="graded">Graded</option>
          <option value="returned">Returned</option>
        </select>
      </StaffFormField>
      {error ? (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="rounded-full border border-baby-blue/40 bg-baby-blue/15 px-5 py-2.5 text-sm text-baby-blue disabled:opacity-50"
      >
        {busy ? "Saving…" : "Save grade"}
      </button>
    </form>
  );
}
