"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { staffFieldClass, StaffFormField } from "@/components/staff/ui";

type Mode = "blank" | "ai";

export function CreateCourseForm({ aiEnabled }: { aiEnabled: boolean }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(aiEnabled ? "ai" : "blank");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onBlankSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    const slug = String(form.get("slug") || "").trim();
    const summary = String(form.get("summary") || "").trim();
    const programKey = String(form.get("programKey") || "").trim();

    try {
      const response = await fetch("/api/staff/records", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          collection: "lms-courses",
          action: "create",
          data: {
            title,
            slug: slug || undefined,
            summary,
            programKey,
            status: "draft",
            accessRule: "enrolled",
          },
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to create course.");
      router.push(`/staff/learning?course=${result.id}&tab=overview`);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create course.");
      setBusy(false);
    }
  }

  async function onAiSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const brief = String(form.get("brief") || "").trim();
    const level = String(form.get("level") || "foundation");
    const audience = String(form.get("audience") || "").trim();

    try {
      const response = await fetch("/api/staff/ai/generate-course", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "generate-course",
          brief,
          level,
          audience: audience || undefined,
        }),
      });
      const result = await response.json();
      if (!response.ok && response.status !== 207) {
        throw new Error(result.error || "Unable to generate the course draft.");
      }
      if (!result.courseId) throw new Error(result.error || "Unable to generate the course draft.");
      router.push(`/staff/learning?course=${result.courseId}&tab=curriculum`);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to generate the course draft.");
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {aiEnabled ? (
          <button
            type="button"
            onClick={() => {
              setMode("ai");
              setError("");
            }}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              mode === "ai"
                ? "border-baby-blue/50 bg-baby-blue/15 text-baby-blue"
                : "border-white/15 text-white/55 hover:border-white/30 hover:text-white"
            }`}
          >
            Use SMN AI assistant
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => {
            setMode("blank");
            setError("");
          }}
          className={`rounded-full border px-4 py-2 text-sm transition ${
            mode === "blank"
              ? "border-baby-blue/50 bg-baby-blue/15 text-baby-blue"
              : "border-white/15 text-white/55 hover:border-white/30 hover:text-white"
          }`}
        >
          Create blank draft
        </button>
      </div>

      {!aiEnabled ? (
        <p className="text-xs text-white/40">
          AI course creation is disabled in this environment. You can still create a blank draft.
        </p>
      ) : null}

      {mode === "ai" && aiEnabled ? (
        <form onSubmit={onAiSubmit} className="space-y-4">
          <StaffFormField label="Describe the course">
            <textarea
              className={staffFieldClass}
              name="brief"
              required
              minLength={20}
              rows={7}
              placeholder="Example: A 4-week foundation course on social media content strategy for early-career marketers in Ghana. Cover audience research, content pillars, short-form video, and a simple measurement loop."
            />
          </StaffFormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <StaffFormField label="Level">
              <select className={staffFieldClass} name="level" defaultValue="foundation">
                <option value="foundation">Foundation</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </StaffFormField>
            <StaffFormField label="Audience (optional)">
              <input
                className={staffFieldClass}
                name="audience"
                maxLength={200}
                placeholder="SMN learners"
                defaultValue="SMN learners"
              />
            </StaffFormField>
          </div>
          <p className="text-xs leading-relaxed text-white/40">
            SMN AI creates a draft course with modules and lessons. You can then edit curriculum, add an instructor,
            polish outcomes, and publish when ready. Nothing is published automatically.
          </p>
          {error ? (
            <p className="rounded-2xl border border-red-300/30 bg-red-300/10 px-4 py-3 text-sm text-red-100" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="rounded-full border border-baby-blue/40 bg-baby-blue/15 px-5 py-2.5 text-sm text-baby-blue transition hover:bg-baby-blue/25 disabled:opacity-50"
          >
            {busy ? "Generating draft course…" : "Generate draft course"}
          </button>
        </form>
      ) : (
        <form onSubmit={onBlankSubmit} className="space-y-4">
          <StaffFormField label="Title">
            <input className={staffFieldClass} name="title" required maxLength={200} placeholder="Course title" />
          </StaffFormField>
          <StaffFormField label="Slug">
            <input className={staffFieldClass} name="slug" maxLength={80} placeholder="auto-from-title if blank" />
          </StaffFormField>
          <StaffFormField label="Summary">
            <textarea className={staffFieldClass} name="summary" required rows={4} placeholder="Short course summary" />
          </StaffFormField>
          <StaffFormField label="Program key">
            <input
              className={staffFieldClass}
              name="programKey"
              required
              maxLength={120}
              placeholder="e.g. digital-marketing-foundations"
            />
          </StaffFormField>
          <p className="text-xs text-white/40">Status is set to draft. Access defaults to matching enrollment.</p>
          {error ? (
            <p className="rounded-2xl border border-red-300/30 bg-red-300/10 px-4 py-3 text-sm text-red-100" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="rounded-full border border-baby-blue/40 bg-baby-blue/15 px-5 py-2.5 text-sm text-baby-blue transition hover:bg-baby-blue/25 disabled:opacity-50"
          >
            {busy ? "Creating…" : "Create draft course"}
          </button>
        </form>
      )}
    </div>
  );
}
