"use client";

import { useState } from "react";
import { CheckCircle2, Circle } from "@/components/ui/icons";

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
        className={`inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-[border-color,background,color] duration-[var(--dur-fast)] ease-[var(--ease-out)] active:scale-[0.97] motion-reduce:active:scale-100 ${
          completed
            ? "border-ai/35 bg-ai-bg text-ai"
            : "border-edge bg-inset text-text-2 hover:border-accent/40 hover:text-text-1"
        }`}
      >
        {completed ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
        {saving ? "Saving…" : completed ? "Completed" : "Mark complete"}
      </button>
      {message ? (
        <p className="text-xs text-text-3" role="status" aria-live="polite">
          {message}
        </p>
      ) : null}
    </div>
  );
}
