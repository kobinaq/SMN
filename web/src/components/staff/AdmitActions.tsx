"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdmitActions({
  applicationId,
  courseId,
  courses,
}: {
  applicationId: string | number;
  courseId?: string;
  courses: Array<{ id: string | number; title: string }>;
}) {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState(courseId || "");
  const [busy, setBusy] = useState<"grant" | "pay-link" | "">("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function run(action: "grant" | "pay-link") {
    setBusy(action);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/staff/applications/admit", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          applicationId,
          action,
          courseId: selectedCourse || undefined,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to complete that action.");
      setMessage(action === "grant" ? "Access granted. Login instructions were emailed." : "Payment link emailed.");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to complete that action.");
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="space-y-4">
      {!courseId && courses.length ? (
        <label className="block text-sm text-white/70">
          Course
          <select
            className="field mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
            value={selectedCourse}
            onChange={(event) => setSelectedCourse(event.target.value)}
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={String(course.id)} value={String(course.id)}>
                {course.title}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={Boolean(busy) || (!courseId && !selectedCourse)}
          onClick={() => void run("grant")}
          className="rounded-full border border-mint/40 bg-mint/15 px-5 py-2.5 text-sm text-mint transition hover:bg-mint/25 disabled:opacity-50"
        >
          {busy === "grant" ? "Granting…" : "Grant access now"}
        </button>
        <button
          type="button"
          disabled={Boolean(busy) || (!courseId && !selectedCourse)}
          onClick={() => void run("pay-link")}
          className="rounded-full border border-baby-blue/40 bg-baby-blue/15 px-5 py-2.5 text-sm text-baby-blue transition hover:bg-baby-blue/25 disabled:opacity-50"
        >
          {busy === "pay-link" ? "Sending…" : "Send Paystack link"}
        </button>
      </div>
      {error ? (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
      {message ? <p className="text-sm text-mint">{message}</p> : null}
    </div>
  );
}
