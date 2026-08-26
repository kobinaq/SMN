"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { staffFieldClass, StaffFormField } from "@/components/staff/ui";
import { Select } from "@/components/ui/Select";

type Mode = "blank" | "ai";

export function CreateCourseForm({ aiEnabled }: { aiEnabled: boolean }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(aiEnabled ? "ai" : "blank");
  const [delivery, setDelivery] = useState<"cohort" | "self-paced">("self-paced");
  const [commerce, setCommerce] = useState<"purchase" | "apply">("purchase");
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
    const deliveryValue = String(form.get("delivery") || "self-paced") === "cohort" ? "cohort" : "self-paced";
    const commerceValue = String(form.get("commerce") || "purchase") === "apply" ? "apply" : "purchase";
    const classroomUrl = String(form.get("classroomUrl") || "").trim();
    const startDate = String(form.get("startDate") || "").trim();
    const applicationDeadline = String(form.get("applicationDeadline") || "").trim();

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
            delivery: deliveryValue,
            commerce: commerceValue,
            classroomUrl: deliveryValue === "cohort" ? classroomUrl || undefined : undefined,
            startDate: deliveryValue === "cohort" ? startDate || undefined : undefined,
            applicationDeadline: deliveryValue === "cohort" ? applicationDeadline || undefined : undefined,
            featured: deliveryValue === "cohort" && form.get("featured") === "on",
          },
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to create course.");
      router.push(`/staff/learning/courses/${result.id}?tab=overview`);
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
      router.push(`/staff/learning/courses/${result.courseId}?tab=curriculum`);
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
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-[var(--dur-fast)] ${
              mode === "ai"
                ? "border-accent/50 bg-accent-bg text-accent"
                : "border-edge text-text-2 hover:border-edge-strong hover:text-text-1"
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
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-[var(--dur-fast)] ${
            mode === "blank"
              ? "border-accent/50 bg-accent-bg text-accent"
              : "border-edge text-text-2 hover:border-edge-strong hover:text-text-1"
          }`}
        >
          Create blank draft
        </button>
      </div>

      {!aiEnabled ? (
        <p className="text-xs text-text-3">
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
              <Select className={staffFieldClass} name="level" defaultValue="foundation">
                <option value="foundation">Foundation</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Select>
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
          <p className="text-xs leading-relaxed text-text-3">
            SMN AI creates a draft course with modules and lessons. You can then edit curriculum, add an instructor,
            polish outcomes, and publish when ready. Nothing is published automatically.
          </p>
          {error ? (
            <p className="rounded-[var(--radius-md)] border border-danger/30 bg-danger-bg px-4 py-3 text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-accent-strong px-5 py-2.5 text-sm font-semibold text-[#08111f] transition-colors duration-[var(--dur-fast)] hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
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
          <StaffFormField label="Programme type">
            <Select
              className={staffFieldClass}
              name="delivery"
              value={delivery}
              onChange={(event) => setDelivery(event.target.value === "cohort" ? "cohort" : "self-paced")}
            >
              <option value="self-paced">Self-paced course</option>
              <option value="cohort">Live cohort</option>
            </Select>
          </StaffFormField>
          <StaffFormField label="How people join">
            <Select
              className={staffFieldClass}
              name="commerce"
              value={commerce}
              onChange={(event) => setCommerce(event.target.value === "apply" ? "apply" : "purchase")}
            >
              <option value="purchase">Buy now (Paystack)</option>
              <option value="apply">Apply first</option>
            </Select>
          </StaffFormField>
          {delivery === "cohort" ? (
            <>
              <StaffFormField label="Google Classroom invite">
                <input
                  className={staffFieldClass}
                  name="classroomUrl"
                  type="url"
                  placeholder="https://classroom.google.com/..."
                />
              </StaffFormField>
              <StaffFormField label="Start (public)">
                <input className={staffFieldClass} name="startDate" placeholder="September 2026" />
              </StaffFormField>
              <StaffFormField label="Application deadline">
                <input className={staffFieldClass} name="applicationDeadline" placeholder="Rolling. Apply early" />
              </StaffFormField>
              <label className="flex items-start gap-3 text-sm text-text-2">
                <input className="mt-1 h-4 w-4 accent-accent" type="checkbox" name="featured" />
                <span>Show as the next intake on the marketing site</span>
              </label>
            </>
          ) : null}
          <p className="text-xs text-text-3">
            Status is set to draft. {delivery === "cohort"
              ? "Published cohorts appear on the marketing site. Classroom lessons can reuse this invite."
              : "Self-paced programmes appear on /programs/courses once published."}{" "}
            {commerce === "apply"
              ? "Apply-first programmes use /apply. Staff then grant access or send a Paystack link."
              : "Buy-now programmes checkout on Paystack after the fee is confirmed."}
          </p>
          {error ? (
            <p className="rounded-[var(--radius-md)] border border-danger/30 bg-danger-bg px-4 py-3 text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-accent-strong px-5 py-2.5 text-sm font-semibold text-[#08111f] transition-colors duration-[var(--dur-fast)] hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
          >
            {busy ? "Creating…" : "Create draft course"}
          </button>
        </form>
      )}
    </div>
  );
}
