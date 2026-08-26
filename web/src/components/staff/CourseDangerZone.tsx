"use client";

import { useState } from "react";
import { Trash2 } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import { DeleteCourseDialog } from "@/components/staff/DeleteCourseDialog";

/**
 * Deliberately separated from the settings form and visually marked, so
 * deleting a course is never one mis-click away from saving a title change.
 */
export function CourseDangerZone({ courseId, courseTitle }: { courseId: string | number; courseTitle: string }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-[var(--radius-lg)] border border-danger/25 bg-danger-bg/40 p-5">
      <h3 className="font-display text-lg text-text-1">Danger zone</h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-2">
        Deleting <strong className="text-text-1">{courseTitle}</strong> also removes its modules, lessons, live
        sessions, attendance, announcements, discussion, assessments, and submitted work. Enrollments are kept but
        detached so learner history and issued certificates survive. This cannot be undone.
      </p>
      <Button type="button" variant="danger" className="mt-4" onClick={() => setOpen(true)}>
        <Trash2 className="h-4 w-4" />
        Delete course
      </Button>

      <DeleteCourseDialog
        open={open}
        courseId={courseId}
        courseTitle={courseTitle}
        onClose={() => setOpen(false)}
      />
    </section>
  );
}
