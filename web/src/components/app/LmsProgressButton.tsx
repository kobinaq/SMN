"use client";

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";

export function LmsProgressButton({
  courseId,
  lessonId,
  initialStatus,
}: {
  courseId: string | number;
  lessonId: string | number;
  initialStatus: "not-started" | "in-progress" | "completed";
}) {
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const completed = status === "completed";

  async function toggle() {
    const next = completed ? "in-progress" : "completed";
    const previous = status;
    setStatus(next);
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/lms-progress", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, lessonId, status: next }),
      });
      if (!response.ok) {
        setStatus(previous);
        const result = await response.json().catch(() => null);
        setMessage(result?.error || "Progress did not save. Your place is unchanged — try again.");
        return;
      }
      setMessage(next === "completed" ? "Progress saved. Lesson marked complete." : "Progress saved.");
    } catch {
      setStatus(previous);
      setMessage("Progress did not save. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={toggle}
        disabled={saving}
        aria-busy={saving}
        className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
          completed
            ? "border-mint/35 bg-mint/10 text-mint"
            : "border-white/15 bg-white/[.03] text-white/70 hover:border-baby-blue/35 hover:text-white"
        }`}
      >
        {completed ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
        {saving ? "Saving…" : completed ? "Completed" : "Mark complete"}
      </button>
      {message ? (
        <p className="text-xs text-white/50" role="status" aria-live="polite">
          {message}
        </p>
      ) : null}
    </div>
  );
}
