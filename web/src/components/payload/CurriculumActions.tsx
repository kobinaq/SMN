"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ID = string | number;

function useCurriculumAction() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function run(body: Record<string, unknown>, confirmation?: string) {
    if (confirmation && !window.confirm(confirmation)) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/course-builder", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to update curriculum.");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update curriculum.");
    } finally { setBusy(false); }
  }
  return { busy, error, run };
}

function moved(ids: ID[], index: number, direction: -1 | 1) {
  const target = index + direction;
  if (target < 0 || target >= ids.length) return ids;
  const next = [...ids];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function ModuleActions({ courseId, moduleId, moduleIds, index, empty }: { courseId: ID; moduleId: ID; moduleIds: ID[]; index: number; empty: boolean }) {
  const { busy, error, run } = useCurriculumAction();
  return <div className="smn-curriculum-actions">
    <button disabled={busy || index === 0} onClick={() => run({ action: "reorder-modules", courseId, ids: moved(moduleIds, index, -1) })} type="button" aria-label="Move module up">↑</button>
    <button disabled={busy || index === moduleIds.length - 1} onClick={() => run({ action: "reorder-modules", courseId, ids: moved(moduleIds, index, 1) })} type="button" aria-label="Move module down">↓</button>
    <button disabled={busy} onClick={() => run({ action: "duplicate-module", courseId, moduleId })} type="button">Duplicate</button>
    <button disabled={busy || !empty} onClick={() => run({ action: "delete-module", courseId, moduleId }, "Delete this empty module? This cannot be undone.")} type="button">Delete</button>
    {error ? <span role="alert">{error}</span> : null}
  </div>;
}

export function LessonActions({ courseId, lessonId, lessonIds, index, moduleId, modules }: { courseId: ID; lessonId: ID; lessonIds: ID[]; index: number; moduleId: ID; modules: Array<{ id: ID; title: string }> }) {
  const { busy, error, run } = useCurriculumAction();
  return <div className="smn-curriculum-actions">
    <button disabled={busy || index === 0} onClick={() => run({ action: "reorder-lessons", courseId, moduleId, ids: moved(lessonIds, index, -1) })} type="button" aria-label="Move lesson up">↑</button>
    <button disabled={busy || index === lessonIds.length - 1} onClick={() => run({ action: "reorder-lessons", courseId, moduleId, ids: moved(lessonIds, index, 1) })} type="button" aria-label="Move lesson down">↓</button>
    <select aria-label="Move lesson to module" disabled={busy} value={String(moduleId)} onChange={(event) => run({ action: "move-lesson", courseId, lessonId, moduleId: event.target.value, order: 0 })}>{modules.map((item) => <option value={String(item.id)} key={item.id}>{item.title}</option>)}</select>
    <button disabled={busy} onClick={() => run({ action: "duplicate-lesson", courseId, lessonId })} type="button">Duplicate</button>
    <button disabled={busy} onClick={() => run({ action: "delete-lesson", courseId, lessonId }, "Delete this lesson? Existing progress records may also need review.")} type="button">Delete</button>
    {error ? <span role="alert">{error}</span> : null}
  </div>;
}
