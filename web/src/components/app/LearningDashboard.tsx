"use client";

import { useMemo, useState } from "react";
import { BookOpen, Check, Circle, Clock, ExternalLink, Play, Users } from "lucide-react";
import type { LearningDashboardItem, LearningEnrollment } from "@/lib/learning";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";

type Status = LearningDashboardItem["status"];
const statusIcon = { "not-started": Circle, "in-progress": Play, completed: Check };

export function LearningDashboard({ initialItems, enrollments }: { initialItems: LearningDashboardItem[]; enrollments: LearningEnrollment[] }) {
  const [items, setItems] = useState(initialItems);
  const [program, setProgram] = useState("All programs");
  const toast = useToast();
  const programs = useMemo(() => ["All programs", ...Array.from(new Set(items.map((item) => item.programKey)))], [items]);
  const visible = program === "All programs" ? items : items.filter((item) => item.programKey === program);
  const completed = items.filter((item) => item.status === "completed").length;
  const percentage = items.length ? Math.round((completed / items.length) * 100) : 0;
  const groups = Array.from(new Set(visible.map((item) => `${item.programKey}|${item.week}`))).map((key) => { const [programKey, week] = key.split("|"); return { key, programKey, week: Number(week), items: visible.filter((item) => item.programKey === programKey && item.week === Number(week)) }; });

  async function update(itemId: string | number, status: Status) {
    const previous = items;
    setItems((current) => current.map((item) => item.id === itemId ? { ...item, status } : item));
    try {
      const response = await fetch("/api/learning-progress", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, status }),
      });
      if (!response.ok) {
        setItems(previous);
        toast.push("Progress didn’t save. Your place is unchanged — try again.", "error");
        return;
      }
      toast.push(status === "completed" ? "Marked complete." : "Progress saved.", "success");
    } catch {
      setItems(previous);
      toast.push("Progress didn’t save. Check your connection and try again.", "error");
    }
  }

  return <div className="space-y-7">
    {enrollments.length ? <section className="grid gap-4 md:grid-cols-2">{enrollments.map((enrollment) => <article key={enrollment.id} className="rounded-2xl border border-white/10 bg-surface p-5"><div className="flex items-start justify-between gap-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-baby-blue">{enrollment.programType === "Cohort" ? <Users className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}</div><span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-wide text-mint">{enrollment.status}</span></div><p className="mt-5 text-xs text-white/40">{enrollment.programType}</p><h2 className="mt-1 font-display text-xl text-white">{enrollment.programName}</h2><div className="mt-5 flex flex-wrap gap-2">{enrollment.classroomUrl ? <Button href={enrollment.classroomUrl} target="_blank" rel="noreferrer" className="px-4 py-2 text-xs">Open Classroom <ExternalLink className="h-3.5 w-3.5" /></Button> : null}{enrollment.courseUrl ? <Button href={enrollment.courseUrl} target="_blank" rel="noreferrer" variant="secondary" className="px-4 py-2 text-xs">Open course <ExternalLink className="h-3.5 w-3.5" /></Button> : null}</div></article>)}</section> : null}
    {items.length ? <><section className="rounded-2xl border border-white/10 bg-ink p-5"><div className="flex items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.18em] text-baby-blue">Your progress</p><p className="mt-2 font-display text-2xl text-white">{completed} of {items.length} complete</p></div><strong className="text-3xl text-mint">{percentage}%</strong></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-mint transition-all" style={{ width: `${percentage}%` }} /></div></section>
    <div className="flex items-center justify-between gap-4"><h2 className="font-display text-2xl text-white">Learning plan</h2>{programs.length > 2 ? <Select className="field max-w-[14rem] rounded-xl border border-white/10 bg-surface px-3 py-2 text-sm text-white" size="sm" value={program} onChange={(event) => setProgram(event.target.value)}>{programs.map((item) => <option key={item}>{item}</option>)}</Select> : null}</div>
    <div className="space-y-5">{groups.map((group) => <section key={group.key}><div className="mb-3 flex items-center gap-3"><span className="rounded-full bg-deep-blue px-3 py-1 text-xs text-white">{group.week ? `Week ${group.week}` : "Start here"}</span><span className="text-xs text-white/35">{group.programKey}</span></div><div className="space-y-2">{group.items.map((item) => { const Icon = statusIcon[item.status]; const next: Status = item.status === "completed" ? "not-started" : item.status === "in-progress" ? "completed" : "in-progress"; return <article key={item.id} className="grid gap-4 rounded-2xl border border-white/10 bg-surface p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"><button type="button" onClick={() => update(item.id, next)} className={`flex h-10 w-10 items-center justify-center rounded-full border ${item.status === "completed" ? "border-mint/40 bg-mint/10 text-mint" : "border-white/15 text-white/40"}`} aria-label={`Mark ${item.title} ${next}`}><Icon className="h-4 w-4" /></button><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-display text-base text-white">{item.title}</h3><span className="text-[10px] uppercase tracking-wide text-baby-blue">{item.kind}</span></div><p className="mt-1 text-sm leading-relaxed text-white/45">{item.summary}</p>{item.estimatedMinutes ? <span className="mt-2 inline-flex items-center gap-1 text-xs text-white/30"><Clock className="h-3 w-3" />{item.estimatedMinutes} min</span> : null}</div>{item.url ? <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-baby-blue">Open <ExternalLink className="h-3.5 w-3.5" /></a> : null}</article>; })}</div></section>)}</div></> : null}
  </div>;
}