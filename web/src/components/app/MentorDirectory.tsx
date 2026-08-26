"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { MapPin, Search, UserRound } from "@/components/ui/icons";
import type { MentorDirectoryItem } from "@/lib/mentors";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Surface";
import { Input, Textarea } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";

export function MentorDirectory({ mentors }: { mentors: MentorDirectoryItem[] }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All topics");
  const [selected, setSelected] = useState<MentorDirectoryItem | null>(null);
  const topics = useMemo(
    () => ["All topics", ...Array.from(new Set(mentors.flatMap((mentor) => mentor.topics))).sort()],
    [mentors],
  );
  const filtered = mentors.filter((mentor) => {
    const haystack = `${mentor.name} ${mentor.title} ${mentor.bio} ${mentor.topics.join(" ")}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (topic === "All topics" || mentor.topics.includes(topic));
  });

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
        <label className="relative block">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-text-3" />
          <Input
            aria-label="Search mentors"
            className="pl-11"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search mentors or specialties"
          />
        </label>
        <Select aria-label="Filter by topic" value={topic} onChange={(event) => setTopic(event.target.value)}>
          {topics.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
      </div>

      {filtered.length ? (
        <div className="rise-stagger mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((mentor, index) => (
            <Card key={mentor.id} style={{ "--i": index } as React.CSSProperties} className="flex flex-col">
              <div className="flex items-start gap-4">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-lg)] bg-accent-bg text-accent">
                  {mentor.imageUrl ? (
                    <Image src={mentor.imageUrl} alt="" fill className="object-cover" sizes="56px" />
                  ) : (
                    <UserRound className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h2 className="font-display text-lg text-text-1">{mentor.name}</h2>
                  <p className="mt-1 text-sm text-accent">{mentor.title}</p>
                  {mentor.location ? (
                    <p className="mt-1 flex items-center gap-1 text-xs text-text-3">
                      <MapPin className="h-3 w-3" />
                      {mentor.location}
                    </p>
                  ) : null}
                </div>
              </div>
              <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-text-2">{mentor.bio}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {mentor.topics.slice(0, 3).map((item) => (
                  <span key={item} className="rounded-full border border-edge-subtle px-2.5 py-1 text-[11px] text-text-2">
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                <span className={mentor.availability === "Available" ? "text-xs text-ai" : "text-xs text-text-3"}>
                  {mentor.availability}
                </span>
                <Button
                  type="button"
                  className="px-4 py-2 text-xs"
                  onClick={() => setSelected(mentor)}
                  disabled={mentor.availability === "Unavailable"}
                >
                  Request guidance
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mt-5 border-dashed text-center text-sm text-text-3">No mentors match those filters yet.</Card>
      )}
      {selected ? <RequestDialog mentor={selected} onClose={() => setSelected(null)} /> : null}
    </>
  );
}

function RequestDialog({ mentor, onClose }: { mentor: MentorDirectoryItem; onClose: () => void }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");
    const response = await fetch("/api/mentor-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...Object.fromEntries(new FormData(event.currentTarget).entries()), mentorId: mentor.id }),
    });
    const json = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      setStatus("error");
      setFeedback(json.error || "Unable to send request.");
      return;
    }
    setStatus("success");
    setFeedback("Request sent. The SMN team will review it and follow up.");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-3 backdrop-blur-sm sm:items-center animate-[staff-fade-in_var(--dur-fast)_var(--ease-out)_both]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mentor-request-title"
    >
      <div className="max-h-[90svh] w-full max-w-xl overflow-y-auto rounded-[var(--radius-lg)] border border-edge bg-overlay p-5 shadow-[var(--shadow-3)] sm:p-7 animate-[rise-in_var(--dur-base)_var(--ease-out)_both]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-accent">Mentorship request</p>
            <h2 id="mentor-request-title" className="mt-2 font-display text-xl text-text-1">
              Ask {mentor.name}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1 text-sm text-text-3 transition-colors hover:bg-inset hover:text-text-1">
            Close
          </button>
        </div>
        {status === "success" ? (
          <div className="mt-6 rounded-[var(--radius-md)] border border-ai/25 bg-ai-bg p-5 text-sm text-ai">{feedback}</div>
        ) : (
          <form className="mt-6 space-y-3" onSubmit={submit}>
            <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />
            <Select name="topic" required defaultValue="">
              <option value="" disabled>
                Choose a topic
              </option>
              {mentor.topics.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
            <Input name="goal" required minLength={10} maxLength={200} placeholder="What would a useful outcome look like?" />
            <Textarea name="message" required minLength={20} maxLength={2000} placeholder="Share context, what you have tried, and where you are stuck." />
            <Select name="preferredFormat" required defaultValue="Video call">
              <option>Video call</option>
              <option>Portfolio review</option>
              <option>Async feedback</option>
              <option>Group office hours</option>
            </Select>
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Sending…" : "Send request"}
            </Button>
            {feedback ? <p className="text-sm text-danger">{feedback}</p> : null}
          </form>
        )}
      </div>
    </div>
  );
}
