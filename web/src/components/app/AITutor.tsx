"use client";

import { useState } from "react";
import { AiMarkdown } from "@/components/ui/AiMarkdown";

type Citation = { id: string; label: string; href: string; excerpt: string };
const modes = [
  ["explain", "Explain"],
  ["simplify", "Simplify"],
  ["example", "Give an example"],
  ["summary", "Summarize"],
  ["revision", "Revision help"],
  ["socratic", "Guide me"],
  ["feedback", "Feedback"],
  ["compare", "Compare"],
  ["next-lesson", "Next lesson"],
] as const;
const suggestions = [
  "Explain the main idea in this lesson",
  "Give me a practical example",
  "Help me revise the key points",
];

export function AITutor({ courseId, lessonId }: { courseId: string | number; lessonId: string | number }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<(typeof modes)[number][0]>("explain");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState<Citation[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  async function ask(value = question) {
    if (!value.trim()) return;
    setBusy(true);
    setError("");
    setFeedback("");
    try {
      const response = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          courseId,
          lessonId,
          mode,
          question: value,
          history: answer ? [{ role: "assistant", content: answer.slice(0, 4000) }] : [],
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Tutor is unavailable.");
      setQuestion(value);
      setAnswer(result.answer);
      setCitations(result.citations || []);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Tutor is unavailable.");
    } finally {
      setBusy(false);
    }
  }

  async function rate(rating: "helpful" | "not-helpful") {
    await fetch("/api/ai/feedback", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        feature: "tutor",
        contextKey: `course:${courseId}:lesson:${lessonId}`,
        rating,
      }),
    });
    setFeedback("Thanks for the feedback.");
  }

  function reset() {
    setQuestion("");
    setAnswer("");
    setCitations([]);
    setError("");
    setFeedback("");
  }

  if (!open) {
    return (
      <button
        className="fixed right-5 bottom-5 z-40 rounded-full bg-mint px-5 py-3 font-semibold text-[#07110c] shadow-xl"
        onClick={() => setOpen(true)}
        type="button"
      >
        Ask SMN Tutor
      </button>
    );
  }

  return (
    <aside
      className="fixed inset-x-3 bottom-3 z-50 max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0b1110] p-4 shadow-2xl sm:left-auto sm:right-5 sm:w-[30rem]"
      aria-label="SMN Course Tutor"
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-widest text-mint uppercase">Course-aware AI</p>
          <h2 className="mt-1 font-display text-xl text-white">SMN Tutor</h2>
        </div>
        <button className="text-white/60 hover:text-white" onClick={() => setOpen(false)} type="button" aria-label="Close Tutor">
          Close
        </button>
      </header>
      <p className="mt-3 text-xs leading-relaxed text-white/50">
        AI can be wrong. SMN sends only what is needed for this request and does not store full prompts or answers in usage logs.
        Review advice before acting.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {modes.map(([value, label]) => (
          <button
            className={`rounded-full px-3 py-1.5 text-xs ${mode === value ? "bg-mint text-[#07110c]" : "bg-white/5 text-white/65"}`}
            key={value}
            onClick={() => setMode(value)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
      {!answer ? (
        <div className="mt-4 grid gap-2">
          {suggestions.map((item) => (
            <button
              className="rounded-lg border border-white/10 p-3 text-left text-sm text-white/70 hover:border-mint/50"
              onClick={() => {
                setQuestion(item);
                void ask(item);
              }}
              key={item}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}
      <label className="mt-4 block text-sm text-white/70">
        Your question
        <textarea
          className="mt-2 min-h-24 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-white"
          maxLength={12000}
          onChange={(event) => setQuestion(event.target.value)}
          value={question}
        />
      </label>
      <div className="mt-3 flex gap-2">
        <button
          className="rounded-lg bg-mint px-4 py-2 font-semibold text-[#07110c] disabled:opacity-50"
          disabled={busy || !question.trim()}
          onClick={() => void ask()}
          type="button"
        >
          {busy ? "Thinking…" : "Ask"}
        </button>
        <button className="rounded-lg border border-white/10 px-4 py-2 text-white/70" onClick={reset} type="button">
          Reset
        </button>
      </div>
      {error ? (
        <p className="mt-3 text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
      {answer ? (
        <section className="mt-4 rounded-xl bg-white/[.04] p-4">
          <h3 className="text-sm font-semibold text-white">Tutor response</h3>
          <div className="mt-2">
            <AiMarkdown content={answer} />
          </div>
          {citations.length ? (
            <div className="mt-4">
              <h4 className="text-xs font-semibold tracking-wider text-white/45 uppercase">Sources</h4>
              <ul className="mt-2 grid gap-2">
                {citations.map((source) => (
                  <li key={source.id}>
                    <a className="text-sm text-mint hover:underline" href={source.href}>
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="mt-4 flex items-center gap-2 text-xs text-white/50">
            <span>Helpful?</span>
            <button onClick={() => void rate("helpful")} type="button">
              Yes
            </button>
            <button onClick={() => void rate("not-helpful")} type="button">
              No
            </button>
            {feedback ? <span aria-live="polite">{feedback}</span> : null}
          </div>
        </section>
      ) : null}
    </aside>
  );
}
