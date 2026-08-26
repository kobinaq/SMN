"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { PublicAssessment } from "@/lib/lms-assess";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Surface";
import { Field, Textarea } from "@/components/ui/Field";

export function LearnerAssessmentForm({
  assessment,
  courseSlug,
}: {
  assessment: PublicAssessment;
  courseSlug: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fileIds, setFileIds] = useState<Array<string | number>>([]);

  async function onUpload(file: File) {
    const form = new FormData();
    form.set("file", file);
    const response = await fetch("/api/lms-assessments/upload", { method: "POST", credentials: "include", body: form });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Upload failed.");
    setFileIds((current) => [...current, result.id]);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const answers: Record<string, string> = {};
    for (const question of assessment.questions) {
      const key = question.id || question.prompt;
      answers[key] = String(form.get(`q-${key}`) || "");
    }
    try {
      const response = await fetch("/api/lms-assessments/submit", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          assessmentId: assessment.id,
          answers,
          textResponse: String(form.get("textResponse") || ""),
          fileIds,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to submit.");
      router.push(`/app/learning/courses/${courseSlug}/grades`);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to submit.");
      setBusy(false);
    }
  }

  const closed = !["open", "late"].includes(assessment.window) || assessment.remaining <= 0;

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {assessment.kind === "quiz" ? (
        assessment.questions.map((question, index) => {
          const key = question.id || question.prompt;
          return (
            <Card key={key} as="section" padded={false} className="p-4">
              <fieldset>
                <legend className="font-display text-base text-text-1">
                  {index + 1}. {question.prompt} <span className="text-xs text-text-3">({question.marks} marks)</span>
                </legend>
                {question.type === "multiple-choice" ? (
                  <div className="mt-3 space-y-2">
                    {question.options.map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-text-2">
                        <input type="radio" name={`q-${key}`} value={option} required className="accent-accent" />
                        {option}
                      </label>
                    ))}
                  </div>
                ) : (
                  <Textarea name={`q-${key}`} rows={4} required className="mt-3" />
                )}
              </fieldset>
            </Card>
          );
        })
      ) : (
        <>
          <Field label="Your response" htmlFor="assessment-response" required>
            <Textarea id="assessment-response" name="textResponse" rows={8} required />
          </Field>
          <Field label="PDF or image (optional)" htmlFor="assessment-file">
            <input
              id="assessment-file"
              type="file"
              accept="application/pdf,image/*"
              className="block w-full text-sm text-text-2 file:mr-3 file:rounded-full file:border-0 file:bg-inset file:px-3 file:py-1.5 file:text-xs file:text-text-1"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void onUpload(file).catch((caught) => setError(caught instanceof Error ? caught.message : "Upload failed."));
              }}
            />
          </Field>
          {fileIds.length ? <p className="text-xs text-ai">{fileIds.length} file attached.</p> : null}
        </>
      )}
      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={busy || closed}>
        {busy ? "Submitting…" : closed ? "Closed" : "Submit"}
      </Button>
    </form>
  );
}
