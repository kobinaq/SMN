"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { staffFieldClass, StaffFormField } from "@/components/staff/ui";

function asRelationId(value: string | number) {
  if (typeof value === "number") return value;
  return /^\d+$/.test(value) ? Number(value) : value;
}

export function AddModuleForm({ courseId, order }: { courseId: string | number; order: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    const title = String(form.get("title") || "").trim();
    try {
      const response = await fetch("/api/staff/records", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          collection: "lms-modules",
          action: "create",
          data: {
            course: asRelationId(courseId),
            title,
            slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60)}-${Date.now().toString(36)}`,
            status: "draft",
            order: Number(order) || 0,
          },
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to add module.");
      formEl.reset();
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to add module.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
      <StaffFormField label="New module title">
        <input className={staffFieldClass} name="title" required maxLength={200} placeholder="Module title" />
      </StaffFormField>
      <button
        type="submit"
        disabled={busy}
        className="shrink-0 rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:border-baby-blue/40 disabled:opacity-50"
      >
        {busy ? "Adding…" : "Add module"}
      </button>
      {error ? <span className="text-xs text-red-300" role="alert">{error}</span> : null}
    </form>
  );
}

export function AddLessonForm({
  courseId,
  moduleId,
  order,
}: {
  courseId: string | number;
  moduleId: string | number;
  order: number;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    const title = String(form.get("title") || "").trim();
    try {
      const response = await fetch("/api/staff/records", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          collection: "lms-lessons",
          action: "create",
          data: {
            course: asRelationId(courseId),
            module: asRelationId(moduleId),
            title,
            slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60)}-${Date.now().toString(36)}`,
            summary: "Draft lesson summary",
            lessonType: "reading",
            status: "draft",
            order: Number(order) || 0,
          },
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to add lesson.");
      formEl.reset();
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to add lesson.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
      <StaffFormField label="New lesson title">
        <input className={staffFieldClass} name="title" required maxLength={200} placeholder="Lesson title" />
      </StaffFormField>
      <button
        type="submit"
        disabled={busy}
        className="shrink-0 rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:border-baby-blue/40 disabled:opacity-50"
      >
        {busy ? "Adding…" : "Add lesson"}
      </button>
      {error ? <span className="text-xs text-red-300" role="alert">{error}</span> : null}
    </form>
  );
}
