"use client";

import { useState } from "react";
import { mentorTopics } from "@/lib/mentor-options";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

const field = "field w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/35";

export function MentorApplication({ status }: { status: string | null }) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  if (status || state === "success") return <div className="rounded-2xl border border-white/10 bg-ink p-5"><p className="font-display text-lg text-white">Application received</p><p className="mt-2 text-sm text-white/50">Status: <span className="capitalize text-baby-blue">{status || "draft"}</span>. Staff will review your profile before it appears in the directory.</p></div>;
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setState("loading"); setFeedback("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/mentor-applications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: form.get("title"), bio: form.get("bio"), seniority: form.get("seniority"), topics: form.getAll("topics"), website: form.get("website") }) });
    const json = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) { setState("error"); setFeedback(json.error || "Unable to apply."); return; }
    setState("success");
  }
  return <form onSubmit={submit} className="space-y-4"><input name="website" className="hidden" tabIndex={-1} autoComplete="off" /><div className="grid gap-3 sm:grid-cols-2"><input name="title" required minLength={3} maxLength={120} className={field} placeholder="Professional title" /><Select name="seniority" required className={`${field} bg-surface`} defaultValue=""><option value="" disabled>Seniority</option><option>Mid-level</option><option>Senior</option><option>Lead / Head</option><option>Founder / Executive</option></Select></div><textarea name="bio" required minLength={80} maxLength={1500} className={`${field} min-h-36 resize-y`} placeholder="Describe your experience, mentoring approach, and the people you can best help." /><fieldset><legend className="text-sm text-white/60">Topics you can mentor on (choose up to five)</legend><div className="mt-3 grid gap-2 sm:grid-cols-2">{mentorTopics.map((topic) => <label key={topic} className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-white/60"><input type="checkbox" name="topics" value={topic} />{topic}</label>)}</div></fieldset><Button type="submit" disabled={state === "loading"}>{state === "loading" ? "Submitting…" : "Submit for review"}</Button>{feedback ? <p className="text-sm text-red-300">{feedback}</p> : null}</form>;
}