"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Tabs for one course. Which tabs exist depends on how the course is
 * delivered — a self-paced course has a module/lesson curriculum, a live
 * cohort has a session schedule and an announcement feed instead. Showing
 * both sets to both kinds was the main thing that made the old builder
 * feel like a form rather than a workspace.
 */
const SELF_PACED = [
  ["overview", "Overview"],
  ["curriculum", "Curriculum"],
  ["assessments", "Assessments"],
  ["gradebook", "Gradebook"],
  ["learners", "Learners"],
  ["analytics", "Analytics"],
  ["settings", "Settings"],
] as const;

const COHORT = [
  ["overview", "Overview"],
  ["sessions", "Sessions"],
  ["announcements", "Announcements"],
  ["assessments", "Assessments"],
  ["gradebook", "Gradebook"],
  ["learners", "Learners"],
  ["analytics", "Analytics"],
  ["settings", "Settings"],
] as const;

export function CourseWorkspaceNav({
  base,
  activeTab,
  studioEnabled,
  cohort,
  needsAttention,
}: {
  base: string;
  activeTab: string;
  studioEnabled: boolean;
  cohort?: boolean;
  /** Marks Overview when the course cannot publish yet. */
  needsAttention?: boolean;
}) {
  const tabs = [
    ...(cohort ? COHORT : SELF_PACED),
    ...(studioEnabled ? ([["ai-content-studio", "AI Studio"]] as const) : []),
  ];

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-edge-subtle" aria-label="Course sections">
      {tabs.map(([key, label]) => {
        const active = activeTab === key;
        return (
          <Link
            key={key}
            href={`${base}?tab=${key}`}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative shrink-0 border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap",
              "transition-colors duration-[var(--dur-fast)] ease-[var(--ease-out)]",
              active ? "border-accent text-text-1" : "border-transparent text-text-3 hover:text-text-2",
            )}
          >
            {label}
            {needsAttention && key === "overview" ? (
              <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-warn align-middle" aria-hidden />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
