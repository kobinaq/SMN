"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { MapPin, Search, UserRound } from "@/components/ui/icons";
import type { MentorDirectoryItem } from "@/lib/mentors";
import { getFocusableElements, trapTabKey } from "@/lib/a11y-focus";
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
  const titleId = useId();
  const errorId = useId();
  const topicId = useId();
  const goalId = useId();
  const messageId = useId();
  const formatId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const node = panelRef.current;
    // Prefer the first field in the form so Close is not the landing target.
    const form = node?.querySelector("form");
    const focusRoot = form || node;
    if (focusRoot) getFocusableElements(focusRoot)[0]?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (panelRef.current) {
        trapTabKey(panelRef.current, event, document.activeElement);
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [onClose]);

  useEffect(() => {
    if (status !== "error") return;
    const form = panelRef.current?.querySelector("form");
    if (form) getFocusableElements(form)[0]?.focus();
  }, [status, feedback]);

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
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={status === "error" ? errorId : undefined}
        className="max-h-[90svh] w-full max-w-xl overflow-y-auto rounded-[var(--radius-lg)] border border-edge bg-overlay p-5 shadow-[var(--shadow-3)] sm:p-7 animate-[rise-in_var(--dur-base)_var(--ease-out)_both]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-accent">Mentorship request</p>
            <h2 id={titleId} className="mt-2 font-display text-xl text-text-1">
              Ask {mentor.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 items-center rounded-full px-3 text-sm text-text-3 transition-colors hover:bg-inset hover:text-text-1"
          >
            Close
          </button>
        </div>
        {status === "success" ? (
          <div className="mt-6 rounded-[var(--radius-md)] border border-ai/25 bg-ai-bg p-5 text-sm text-ai" role="status" aria-live="polite">
            {feedback}
          </div>
        ) : (
          <form className="mt-6 space-y-3" onSubmit={submit}>
            <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />
            <div>
              <label id={`${topicId}-label`} htmlFor={topicId} className="mb-1.5 block text-sm font-medium text-text-2">
                Topic
              </label>
              <Select
                id={topicId}
                name="topic"
                required
                defaultValue=""
                aria-labelledby={`${topicId}-label`}
              >
                <option value="" disabled>
                  Choose a topic
                </option>
                {mentor.topics.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
            </div>
            <div>
              <label htmlFor={goalId} className="mb-1.5 block text-sm font-medium text-text-2">
                Desired outcome
              </label>
              <Input
                id={goalId}
                name="goal"
                required
                minLength={10}
                maxLength={200}
                placeholder="What would a useful outcome look like?"
              />
            </div>
            <div>
              <label htmlFor={messageId} className="mb-1.5 block text-sm font-medium text-text-2">
                Context
              </label>
              <Textarea
                id={messageId}
                name="message"
                required
                minLength={20}
                maxLength={2000}
                placeholder="Share context, what you have tried, and where you are stuck."
              />
            </div>
            <div>
              <label id={`${formatId}-label`} htmlFor={formatId} className="mb-1.5 block text-sm font-medium text-text-2">
                Preferred format
              </label>
              <Select
                id={formatId}
                name="preferredFormat"
                required
                defaultValue="Video call"
                aria-labelledby={`${formatId}-label`}
              >
                <option>Video call</option>
                <option>Portfolio review</option>
                <option>Async feedback</option>
                <option>Group office hours</option>
              </Select>
            </div>
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Sending…" : "Send request"}
            </Button>
            {feedback ? (
              <p id={errorId} className="text-sm text-danger" role="alert" aria-live="assertive">
                {feedback}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </div>
  );
}
