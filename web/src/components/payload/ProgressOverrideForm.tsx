"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Select } from "@/components/ui/Select";

type Option = { id: string | number; label: string };

export function ProgressOverrideForm({
  courseId,
  learners,
  lessons,
}: {
  courseId: string | number;
  learners: Option[];
  lessons: Option[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/progress-overrides", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        courseId,
        memberId: data.get("memberId"),
        lessonId: data.get("lessonId"),
        status: data.get("status"),
        reason: data.get("reason"),
      }),
    });
    const result = await response.json();
    setMessage(response.ok ? "Audited override saved." : result.error || "Unable to save override.");
    setBusy(false);
    if (response.ok) {
      event.currentTarget.reset();
      router.refresh();
    }
  }
  return (
    <form className="smn-override-form" onSubmit={submit}>
      <label>
        Learner
        <Select name="memberId" required defaultValue="" className="mt-1">
          <option value="" disabled>
            Select learner
          </option>
          {learners.map((item) => (
            <option value={String(item.id)} key={item.id}>
              {item.label}
            </option>
          ))}
        </Select>
      </label>
      <label>
        Lesson
        <Select name="lessonId" required defaultValue="" className="mt-1">
          <option value="" disabled>
            Select lesson
          </option>
          {lessons.map((item) => (
            <option value={String(item.id)} key={item.id}>
              {item.label}
            </option>
          ))}
        </Select>
      </label>
      <label>
        Status
        <Select name="status" required defaultValue="completed" className="mt-1">
          <option value="not-started">Not started</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
        </Select>
      </label>
      <label className="smn-override-reason">
        Reason
        <textarea name="reason" required minLength={10} placeholder="Explain why this correction is required." />
      </label>
      <button disabled={busy || !learners.length || !lessons.length} type="submit">
        {busy ? "Saving…" : "Save audited override"}
      </button>
      {message ? <p role="status">{message}</p> : null}
    </form>
  );
}
