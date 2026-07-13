"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { staffFieldClass, StaffFormField } from "@/components/staff/ui";

export function CreateCourseForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
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

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
        <input className={staffFieldClass} name="programKey" required maxLength={120} placeholder="e.g. digital-marketing-foundations" />
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
  );
}
