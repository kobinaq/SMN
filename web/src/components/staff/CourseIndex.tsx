"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { BookOpen, Plus, Search, Trash2, Users } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Surface";
import { Chip } from "@/components/ui/Chip";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Input } from "@/components/ui/Field";
import { StaffEmptyState, StaffFilterChips } from "@/components/staff/ui";
import { DeleteCourseDialog } from "@/components/staff/DeleteCourseDialog";

export type CourseSummary = {
  id: string | number;
  title: string;
  slug: string;
  summary: string;
  status: "draft" | "published" | "archived";
  delivery: "self-paced" | "cohort";
  programKey: string;
  instructor: string;
  moduleCount: number;
  lessonCount: number;
  sessionCount: number;
  learnerCount: number;
  updatedAt: string;
  ready: boolean;
};

type StatusFilter = "all" | "draft" | "published" | "archived";

function relativeDate(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const days = Math.round((Date.now() - date.getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString("en-GH", { dateStyle: "medium" });
}

/** Warning shown before opening a record whose edits ripple outward. */
export type OpenWarning = { title: string; description: string };

export function CourseIndex({
  courses,
  newHref = "/staff/learning/courses/new",
  newLabel = "New course",
  emptyTitle = "No courses yet",
  emptyDescription = "Create your first programme — a self-paced course members work through on their own, or a live cohort with a scheduled session plan.",
  warnOnOpen,
}: {
  courses: CourseSummary[];
  /** Where the "create" affordances point. */
  newHref?: string;
  newLabel?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  /** When set, opening a course asks for confirmation first (live-cohort edits). */
  warnOnOpen?: OpenWarning;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [pendingDelete, setPendingDelete] = useState<CourseSummary | null>(null);
  const [pendingOpen, setPendingOpen] = useState<CourseSummary | null>(null);

  const workspaceHref = (course: CourseSummary) => `/staff/learning/courses/${course.id}`;

  function openCourse(course: CourseSummary) {
    if (warnOnOpen) setPendingOpen(course);
    else router.push(workspaceHref(course));
  }

  const counts = useMemo(
    () => ({
      all: courses.length,
      draft: courses.filter((course) => course.status === "draft").length,
      published: courses.filter((course) => course.status === "published").length,
      archived: courses.filter((course) => course.status === "archived").length,
    }),
    [courses],
  );

  const filtered = courses.filter((course) => {
    const haystack = `${course.title} ${course.programKey} ${course.summary} ${course.instructor}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (status === "all" || course.status === status);
  });

  if (!courses.length) {
    return (
      <StaffEmptyState
        title={emptyTitle}
        description={emptyDescription}
        steps={[
          { label: newLabel, href: newHref, active: true },
          { label: "Add content" },
          { label: "Publish" },
        ]}
        action={{ href: newHref, label: newLabel }}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <label className="relative block">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-text-3" />
          <Input
            aria-label="Search courses"
            className="pl-11"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, program key, or instructor"
          />
        </label>
        <StaffFilterChips
          value={status}
          onChange={(next) => setStatus(next as StatusFilter)}
          options={[
            { id: "all", label: "All", count: counts.all },
            { id: "draft", label: "Draft", count: counts.draft },
            { id: "published", label: "Published", count: counts.published },
            ...(counts.archived ? [{ id: "archived", label: "Archived", count: counts.archived }] : []),
          ]}
        />
      </div>

      {filtered.length ? (
        <div className="rise-stagger grid gap-3 lg:grid-cols-2">
          {filtered.map((course, index) => {
            const isCohort = course.delivery === "cohort";
            return (
              <Card key={course.id} style={{ "--i": index } as React.CSSProperties} className="flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] ${
                      isCohort ? "bg-ai-bg text-ai" : "bg-accent-bg text-accent"
                    }`}
                  >
                    {isCohort ? <Users className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
                  </span>
                  <div className="flex flex-wrap justify-end gap-1.5">
                    <Chip tone={isCohort ? "ai" : "accent"}>{isCohort ? "Live cohort" : "Self-paced"}</Chip>
                    <Chip
                      tone={course.status === "published" ? "ai" : course.status === "draft" ? "warn" : "neutral"}
                    >
                      {course.status}
                    </Chip>
                  </div>
                </div>

                <h3 className="mt-4 font-display text-lg text-text-1">
                  {warnOnOpen ? (
                    <button
                      type="button"
                      onClick={() => openCourse(course)}
                      className="text-left transition-colors hover:text-accent"
                    >
                      {course.title}
                    </button>
                  ) : (
                    <Link
                      href={workspaceHref(course)}
                      className="transition-colors hover:text-accent"
                    >
                      {course.title}
                    </Link>
                  )}
                </h3>
                <p className="mt-1 font-mono text-xs text-text-3">{course.programKey}</p>
                {course.summary ? (
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-2">{course.summary}</p>
                ) : null}

                <div className="tnum mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-3">
                  {isCohort ? (
                    <span>{course.sessionCount} sessions</span>
                  ) : (
                    <span>
                      {course.moduleCount} modules · {course.lessonCount} lessons
                    </span>
                  )}
                  <span>{course.learnerCount} learners</span>
                  <span>Updated {relativeDate(course.updatedAt)}</span>
                </div>

                {course.status === "draft" && !course.ready ? (
                  <p className="mt-3 text-xs text-warn">Not ready to publish — open the course to see what&rsquo;s missing.</p>
                ) : null}

                <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                  {warnOnOpen ? (
                    <Button type="button" onClick={() => openCourse(course)} className="px-4 py-2 text-xs">
                      Open
                    </Button>
                  ) : (
                    <Button href={workspaceHref(course)} className="px-4 py-2 text-xs">
                      Open
                    </Button>
                  )}
                  {course.status === "published" ? (
                    <Button
                      href={`/app/learning/courses/${course.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      variant="secondary"
                      className="px-4 py-2 text-xs"
                    >
                      Preview
                    </Button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setPendingDelete(course)}
                    aria-label={`Delete ${course.title}`}
                    className="ml-auto rounded-full p-2 text-text-3 transition-colors hover:bg-danger-bg hover:text-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-dashed text-center">
          <p className="text-sm text-text-2">No courses match “{query || status}”.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setQuery("");
                setStatus("all");
              }}
            >
              Clear filters
            </Button>
            <Button href={newHref}>
              <Plus className="h-4 w-4" />
              {newLabel}
            </Button>
          </div>
        </Card>
      )}

      <DeleteCourseDialog
        open={pendingDelete !== null}
        courseId={pendingDelete?.id ?? ""}
        courseTitle={pendingDelete?.title ?? ""}
        onClose={() => setPendingDelete(null)}
      />

      {warnOnOpen ? (
        <ConfirmDialog
          open={pendingOpen !== null}
          title={warnOnOpen.title}
          description={warnOnOpen.description}
          confirmLabel="Edit cohort"
          cancelLabel="Cancel"
          onConfirm={() => {
            if (pendingOpen) router.push(workspaceHref(pendingOpen));
          }}
          onClose={() => setPendingOpen(null)}
        />
      ) : null}
    </div>
  );
}
