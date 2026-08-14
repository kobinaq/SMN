"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { PublicAssessment } from "@/lib/lms-assess";

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
      {assessment.kind === "quiz"
        ? assessment.questions.map((question, index) => {
            const key = question.id || question.prompt;
            return (
              <fieldset key={key} className="rounded-2xl border border-white/10 bg-surface p-4">
                <legend className="font-display text-base text-white">
                  {index + 1}. {question.prompt}{" "}
                  <span className="text-xs text-white/40">({question.marks} marks)</span>
                </legend>
                {question.type === "multiple-choice" ? (
                  <div className="mt-3 space-y-2">
                    {question.options.map((option) => (
                      <label key={option} className="flex items-center gap-2 text-sm text-white/70">
                        <input type="radio" name={`q-${key}`} value={option} required />
                        {option}
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    className="field mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                    name={`q-${key}`}
                    rows={4}
                    required
                  />
                )}
              </fieldset>
            );
          })
        : (
          <>
            <label className="block text-sm text-white/70">
              Your response
              <textarea
                className="field mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                name="textResponse"
                rows={8}
                required
              />
            </label>
            <label className="block text-sm text-white/70">
              PDF or image (optional)
              <input
                className="mt-2 block text-sm text-white/55"
                type="file"
                accept="application/pdf,image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void onUpload(file).catch((caught) => setError(caught instanceof Error ? caught.message : "Upload failed."));
                }}
              />
            </label>
            {fileIds.length ? <p className="text-xs text-mint">{fileIds.length} file attached.</p> : null}
          </>
        )}
      {error ? (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy || closed}
        className="rounded-full bg-deep-blue px-5 py-2.5 text-sm text-white disabled:opacity-50"
      >
        {busy ? "Submitting…" : closed ? "Closed" : "Submit"}
      </button>
    </form>
  );
}
