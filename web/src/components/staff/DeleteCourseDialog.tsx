"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";

/**
 * Destructive confirmation for deleting a course. The operator must type the
 * course's exact title before the button enables — a deliberate speed bump,
 * because this also removes every module, lesson, session, assessment and
 * submission underneath it. The server re-checks the typed title independently.
 */
export function DeleteCourseDialog({
  courseId,
  courseTitle,
  open,
  onClose,
  redirectTo = "/staff/learning",
}: {
  courseId: string | number;
  courseTitle: string;
  open: boolean;
  onClose: () => void;
  redirectTo?: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const titleId = useId();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const matches = typed.trim() === courseTitle.trim();

  // Clear the previous attempt whenever the dialog opens. Adjusted during
  // render via a stored previous value rather than in an effect, which would
  // cascade an extra render — the same pattern the portal shell uses.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setTyped("");
      setError("");
    }
  }

  // Focus in on open, restore it on close. Keyed only on `open` so typing
  // never re-runs this and yanks focus back to the top of the input.
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    return () => previous?.focus();
  }, [open]);

  // Escape to dismiss, but never mid-delete — the request is already in
  // flight. Separate from the focus effect so re-binding on `busy` is cheap.
  useEffect(() => {
    if (!open || busy) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, busy, onClose]);

  if (!open) return null;

  async function confirm() {
    if (!matches || busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/staff/courses/delete", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ courseId, confirmTitle: typed.trim() }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to delete this course.");
      toast.push(`Deleted “${courseTitle}”.`, "success");
      onClose();
      router.push(redirectTo);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to delete this course.");
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center animate-[staff-fade-in_var(--dur-fast)_var(--ease-out)_both]"
      role="presentation"
      onClick={() => !busy && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-[var(--radius-lg)] border border-danger/30 bg-overlay p-5 shadow-[var(--shadow-3)] animate-[rise-in_var(--dur-base)_var(--ease-out)_both]"
      >
        <h2 id={titleId} className="font-display text-xl text-text-1">
          Delete this course?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-text-2">
          This permanently deletes <strong className="text-text-1">{courseTitle}</strong> and everything inside it —
          modules, lessons, live sessions, attendance, announcements, discussion, assessments, and submitted work.
          Enrollments are kept but detached, so learner history and issued certificates survive.
        </p>
        <p className="mt-3 text-sm text-text-2">
          Type <strong className="text-danger">{courseTitle}</strong> to confirm.
        </p>
        <label htmlFor={inputId} className="sr-only">
          Course title confirmation
        </label>
        <Input
          id={inputId}
          ref={inputRef}
          className="mt-2"
          value={typed}
          autoComplete="off"
          placeholder={courseTitle}
          onChange={(event) => setTyped(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && matches) void confirm();
          }}
        />
        {error ? (
          <p className="mt-3 rounded-[var(--radius-md)] bg-danger-bg px-3 py-2 text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button type="button" variant="danger" onClick={confirm} disabled={!matches || busy}>
            {busy ? "Deleting…" : "Delete course"}
          </Button>
        </div>
      </div>
    </div>
  );
}
