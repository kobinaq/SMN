"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { StaffEntitySwitcher } from "@/components/staff/StaffEntitySwitcher";

const PRIMARY_TABS = [
  ["overview", "Overview"],
  ["curriculum", "Curriculum"],
  ["settings", "Settings"],
] as const;

const MORE_TABS = [
  ["learners", "Learners"],
  ["analytics", "Analytics"],
  ["ai-content-studio", "AI Studio"],
] as const;

export function LearningCourseSwitcher({
  courses,
  courseId,
  activeTab,
}: {
  courses: Array<{ id: string | number; title: string; status?: string | null }>;
  courseId: string;
  activeTab: string;
}) {
  return (
    <StaffEntitySwitcher
      storageKey="learning-courses"
      placeholder="Find a program…"
      value={courseId}
      items={courses.map((course) => ({
        id: course.id,
        label: course.title,
        detail: course.status || undefined,
      }))}
      onSelectHref={(item) => `/staff/learning?course=${item.id}&tab=${activeTab}`}
    />
  );
}

export function LearningTabNav({
  base,
  activeTab,
  studioEnabled,
  highlightCurriculum,
}: {
  base: string;
  activeTab: string;
  studioEnabled: boolean;
  highlightCurriculum?: boolean;
}) {
  const [moreOpen, setMoreOpen] = useState(
    MORE_TABS.some(([key]) => key === activeTab) || (studioEnabled && activeTab === "ai-content-studio"),
  );
  const [cue, setCue] = useState(false);

  useEffect(() => {
    if (!highlightCurriculum) return;
    const key = "smn-staff-curriculum-cue";
    if (typeof window === "undefined") return;
    if (localStorage.getItem(key)) return;
    setCue(true);
    localStorage.setItem(key, "1");
    const timer = window.setTimeout(() => setCue(false), 4000);
    return () => window.clearTimeout(timer);
  }, [highlightCurriculum]);

  const moreTabs = MORE_TABS.filter(([key]) => key !== "ai-content-studio" || studioEnabled);

  return (
    <div className="space-y-2">
      <nav className="flex gap-1 overflow-x-auto border-b border-white/10 pb-px" aria-label="Learning sections">
        {PRIMARY_TABS.map(([key, label]) => (
          <Link
            key={key}
            href={`${base}&tab=${key}`}
            aria-current={activeTab === key ? "page" : undefined}
            className={cn(
              "relative shrink-0 border-b-2 px-4 py-3 text-xs transition",
              activeTab === key ? "border-baby-blue text-white" : "border-transparent text-white/45 hover:text-white/70",
              cue && key === "curriculum" && "text-baby-blue",
            )}
          >
            {label}
            {cue && key === "curriculum" ? (
              <span className="absolute -top-1 right-1 h-1.5 w-1.5 rounded-full bg-baby-blue" aria-hidden />
            ) : null}
          </Link>
        ))}
        <button
          type="button"
          className={cn(
            "shrink-0 border-b-2 px-4 py-3 text-xs transition",
            moreOpen || moreTabs.some(([key]) => key === activeTab)
              ? "border-transparent text-white/70"
              : "border-transparent text-white/35 hover:text-white/60",
          )}
          onClick={() => setMoreOpen((value) => !value)}
          aria-expanded={moreOpen}
        >
          More
        </button>
      </nav>
      {moreOpen ? (
        <nav className="flex flex-wrap gap-2" aria-label="More learning tools">
          {moreTabs.map(([key, label]) => (
            <Link
              key={key}
              href={`${base}&tab=${key}`}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition",
                activeTab === key
                  ? "border-baby-blue/45 bg-baby-blue/15 text-baby-blue"
                  : "border-white/10 text-white/50 hover:border-white/25 hover:text-white",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
