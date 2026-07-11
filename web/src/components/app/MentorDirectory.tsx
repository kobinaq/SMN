"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { MapPin, Search, UserRound } from "lucide-react";
import type { MentorDirectoryItem } from "@/lib/mentors";
import { Button } from "@/components/ui/Button";

const field = "field w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/35";

export function MentorDirectory({ mentors }: { mentors: MentorDirectoryItem[] }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All topics");
  const [selected, setSelected] = useState<MentorDirectoryItem | null>(null);
  const topics = useMemo(() => ["All topics", ...Array.from(new Set(mentors.flatMap((mentor) => mentor.topics))).sort()], [mentors]);
  const filtered = mentors.filter((mentor) => {
    const haystack = `${mentor.name} ${mentor.title} ${mentor.bio} ${mentor.topics.join(" ")}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (topic === "All topics" || mentor.topics.includes(topic));
  });

  return <>
    <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
      <label className="relative"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" /><input aria-label="Search mentors" className={`${field} pl-11`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search mentors or specialties" /></label>
      <select aria-label="Filter by topic" className={`${field} bg-surface`} value={topic} onChange={(event) => setTopic(event.target.value)}>{topics.map((item) => <option key={item} className="bg-near-black">{item}</option>)}</select>
    </div>
    {filtered.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((mentor) => <article key={mentor.id} className="flex flex-col rounded-2xl border border-white/10 bg-surface p-5 sm:p-6">
      <div className="flex items-start gap-4"><div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/5 text-baby-blue">{mentor.imageUrl ? <Image src={mentor.imageUrl} alt="" fill className="object-cover" sizes="56px" /> : <UserRound className="h-6 w-6" />}</div><div><h2 className="font-display text-lg text-white">{mentor.name}</h2><p className="mt-1 text-sm text-baby-blue">{mentor.title}</p>{mentor.location ? <p className="mt-1 flex items-center gap-1 text-xs text-white/40"><MapPin className="h-3 w-3" />{mentor.location}</p> : null}</div></div>
      <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-white/55">{mentor.bio}</p><div className="mt-4 flex flex-wrap gap-1.5">{mentor.topics.slice(0, 3).map((item) => <span key={item} className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/55">{item}</span>)}</div>
      <div className="mt-auto flex items-center justify-between gap-3 pt-6"><span className={mentor.availability === "Available" ? "text-xs text-mint" : "text-xs text-white/40"}>{mentor.availability}</span><Button type="button" className="px-4 py-2 text-xs" onClick={() => setSelected(mentor)} disabled={mentor.availability === "Unavailable"}>Request guidance</Button></div>
    </article>)}</div> : <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-white/50">No mentors match those filters yet.</div>}
    {selected ? <RequestDialog mentor={selected} onClose={() => setSelected(null)} /> : null}
  </>;
}

function RequestDialog({ mentor, onClose }: { mentor: MentorDirectoryItem; onClose: () => void }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("loading"); setFeedback("");
    const response = await fetch("/api/mentor-requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...Object.fromEntries(new FormData(event.currentTarget).entries()), mentorId: mentor.id }) });
    const json = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) { setStatus("error"); setFeedback(json.error || "Unable to send request."); return; }
    setStatus("success"); setFeedback("Request sent. The SMN team will review it and follow up.");
  }
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-3 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-labelledby="mentor-request-title"><div className="max-h-[90svh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-surface p-5 shadow-2xl sm:p-7">
    <div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.18em] text-baby-blue">Mentorship request</p><h2 id="mentor-request-title" className="mt-2 font-display text-xl text-white">Ask {mentor.name}</h2></div><button type="button" onClick={onClose} className="rounded-full px-3 py-1 text-sm text-white/50 hover:bg-white/10 hover:text-white">Close</button></div>
    {status === "success" ? <div className="mt-6 rounded-2xl border border-mint/25 bg-mint/5 p-5 text-sm text-mint">{feedback}</div> : <form className="mt-6 space-y-3" onSubmit={submit}><input name="website" className="hidden" tabIndex={-1} autoComplete="off" /><select name="topic" required className={`${field} bg-surface`} defaultValue=""><option value="" disabled>Choose a topic</option>{mentor.topics.map((item) => <option key={item}>{item}</option>)}</select><input name="goal" required minLength={10} maxLength={200} className={field} placeholder="What would a useful outcome look like?" /><textarea name="message" required minLength={20} maxLength={2000} className={`${field} min-h-32 resize-y`} placeholder="Share context, what you have tried, and where you are stuck." /><select name="preferredFormat" required className={`${field} bg-surface`} defaultValue="Video call"><option>Video call</option><option>Portfolio review</option><option>Async feedback</option><option>Group office hours</option></select><Button type="submit" disabled={status === "loading"}>{status === "loading" ? "Sending…" : "Send request"}</Button>{feedback ? <p className="text-sm text-red-300">{feedback}</p> : null}</form>}
  </div></div>;
}