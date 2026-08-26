"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/Select";
import { staffFieldClass, StaffFormField } from "@/components/staff/ui";

function asRelationId(value: string | number) {
  if (typeof value === "number") return value;
  return /^\d+$/.test(value) ? Number(value) : value;
}

const submitClass =
  "shrink-0 rounded-full border border-edge bg-inset px-4 py-3 text-sm text-text-1 transition hover:border-accent/40 disabled:opacity-50";

async function postRecord(body: unknown) {
  const response = await fetch("/api/staff/records", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Unable to save.");
  return result;
}

export function AddSessionForm({ courseId, order }: { courseId: string | number; order: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    try {
      await postRecord({
        collection: "lms-sessions",
        action: "create",
        data: {
          course: asRelationId(courseId),
          title: String(form.get("title") || "").trim(),
          sessionAt: String(form.get("sessionAt") || ""),
          joinUrl: String(form.get("joinUrl") || "").trim(),
          durationMinutes: String(form.get("durationMinutes") || ""),
          order: Number(order) || 0,
          status: "published",
        },
      });
      formEl.reset();
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to add session.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 grid gap-3 rounded-[var(--radius-lg)] border border-edge-subtle bg-inset p-4 sm:grid-cols-2">
      <StaffFormField label="Session title">
        <input className={staffFieldClass} name="title" required maxLength={200} placeholder="e.g. Week 1 · Positioning" />
      </StaffFormField>
      <StaffFormField label="Starts at">
        <input className={staffFieldClass} name="sessionAt" type="datetime-local" required />
      </StaffFormField>
      <StaffFormField label="Join link (Meet / Zoom / Classroom)">
        <input className={staffFieldClass} name="joinUrl" type="url" placeholder="https://…" />
      </StaffFormField>
      <StaffFormField label="Duration (minutes)">
        <input className={staffFieldClass} name="durationMinutes" type="number" min={0} placeholder="90" />
      </StaffFormField>
      <div className="sm:col-span-2 flex items-center gap-3">
        <button type="submit" disabled={busy} className={submitClass}>
          {busy ? "Adding…" : "Add session"}
        </button>
        {error ? <span className="text-xs text-danger" role="alert">{error}</span> : null}
      </div>
    </form>
  );
}

const ATTENDANCE_OPTIONS = [
  { label: "—", value: "" },
  { label: "Present", value: "present" },
  { label: "Late", value: "late" },
  { label: "Excused", value: "excused" },
  { label: "Absent", value: "absent" },
];

export function AttendanceRegister({
  sessionId,
  courseId,
  roster,
  initial,
}: {
  sessionId: string | number;
  courseId: string | number;
  roster: Array<{ id: string | number; label: string }>;
  initial: Record<string, string>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(() => {
    const next: Record<string, string> = {};
    for (const person of roster) next[String(person.id)] = initial[String(person.id)] || "";
    return next;
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  function setAll(status: string) {
    const next: Record<string, string> = {};
    for (const person of roster) next[String(person.id)] = status;
    setValues(next);
  }

  async function save() {
    setBusy(true);
    setMessage("");
    try {
      const entries = roster.map((person) => ({ memberId: person.id, status: values[String(person.id)] || "" }));
      const response = await fetch("/api/staff/attendance", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId, courseId, entries }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to save attendance.");
      setMessage("Attendance saved.");
      router.refresh();
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Unable to save attendance.");
    } finally {
      setBusy(false);
    }
  }

  if (!roster.length) {
    return <p className="mt-3 text-sm text-text-3">No enrolled members to mark yet.</p>;
  }

  return (
    <div className="mt-3">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setAll("present")} className="rounded-full border border-edge px-3 py-1 text-xs text-text-2 hover:border-ai/40">
          Mark all present
        </button>
        <button type="button" onClick={() => setAll("")} className="rounded-full border border-edge px-3 py-1 text-xs text-text-2 hover:border-edge-strong">
          Clear all
        </button>
      </div>
      <div className="space-y-1">
        {roster.map((person) => (
          <div key={String(person.id)} className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-edge-subtle px-3 py-2">
            <span className="text-sm text-text-2">{person.label}</span>
            <Select
              className="w-36"
              value={values[String(person.id)] || ""}
              onChange={(event) => setValues((current) => ({ ...current, [String(person.id)]: event.target.value }))}
            >
              {ATTENDANCE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button type="button" onClick={save} disabled={busy} className={submitClass}>
          {busy ? "Saving…" : "Save attendance"}
        </button>
        {message ? <span className="text-xs text-text-2" aria-live="polite">{message}</span> : null}
      </div>
    </div>
  );
}

export function AnnouncementComposer({ courseId }: { courseId: string | number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    try {
      await postRecord({
        collection: "lms-announcements",
        action: "create",
        data: {
          course: asRelationId(courseId),
          title: String(form.get("title") || "").trim(),
          body: String(form.get("body") || "").trim(),
          pinned: form.get("pinned") === "on",
          status: "published",
        },
      });
      formEl.reset();
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to post announcement.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-[var(--radius-lg)] border border-edge-subtle bg-inset p-4">
      <StaffFormField label="Announcement title">
        <input className={staffFieldClass} name="title" required maxLength={200} placeholder="e.g. This week's brief" />
      </StaffFormField>
      <StaffFormField label="Message">
        <textarea className={`${staffFieldClass} min-h-28`} name="body" required placeholder="Share an update with the cohort…" />
      </StaffFormField>
      <label className="flex items-center gap-2 text-sm text-text-2">
        <input type="checkbox" name="pinned" className="h-4 w-4 accent-accent" />
        Pin to the top of the cohort feed
      </label>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={busy} className={submitClass}>
          {busy ? "Posting…" : "Post announcement"}
        </button>
        {error ? <span className="text-xs text-danger" role="alert">{error}</span> : null}
      </div>
    </form>
  );
}
