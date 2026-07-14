"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AiMarkdown } from "@/components/ui/AiMarkdown";
import { cn } from "@/lib/utils";

type Citation = { id: string; label: string; href: string; excerpt: string };
type TutorMode =
  | "explain"
  | "simplify"
  | "example"
  | "summary"
  | "revision"
  | "socratic"
  | "feedback"
  | "compare"
  | "next-lesson";
type Intent = "study" | "practice" | "navigate";
type ThreadMessage = {
  role: "member" | "tutor";
  content: string;
  citations?: Citation[];
};

const intents: Array<{ id: Intent; label: string; modes: Array<[TutorMode, string]> }> = [
  {
    id: "study",
    label: "Study",
    modes: [
      ["explain", "Explain"],
      ["simplify", "Simplify"],
      ["summary", "Summarize"],
    ],
  },
  {
    id: "practice",
    label: "Practice",
    modes: [
      ["example", "Example"],
      ["revision", "Revision"],
      ["feedback", "Feedback"],
      ["socratic", "Guide me"],
    ],
  },
  {
    id: "navigate",
    label: "Navigate",
    modes: [
      ["next-lesson", "Next lesson"],
      ["compare", "Compare"],
    ],
  },
];

const suggestionsByIntent: Record<Intent, string[]> = {
  study: [
    "Explain the main idea in this lesson",
    "Simplify the hardest part for me",
    "Summarize the key takeaways",
  ],
  practice: [
    "Give me a practical example I can try",
    "Quiz me on the key points",
    "Give feedback on how I’d apply this at work",
  ],
  navigate: [
    "What should I study next after this lesson?",
    "Compare this idea with the previous lesson",
    "Where does this fit in the wider course?",
  ],
};

export function AITutor({ courseId, lessonId }: { courseId: string | number; lessonId: string | number }) {
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState<Intent>("study");
  const [modeByIntent, setModeByIntent] = useState<Record<Intent, TutorMode>>({
    study: "explain",
    practice: "example",
    navigate: "next-lesson",
  });
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);

  const mode = modeByIntent[intent];
  const intentConfig = intents.find((item) => item.id === intent)!;
  const suggestions = suggestionsByIntent[intent];
  const lastTutor = useMemo(
    () => [...messages].reverse().find((message) => message.role === "tutor"),
    [messages],
  );

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const node = threadRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, busy, open]);

  async function ask(value = question) {
    if (!value.trim() || busy) return;
    const previousTutor = [...messages].reverse().find((message) => message.role === "tutor");
    setBusy(true);
    setError("");
    setFeedback("");
    setMessages((current) => [...current, { role: "member", content: value.trim() }]);
    setQuestion("");
    try {
      const response = await fetch("/api/ai/tutor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          courseId,
          lessonId,
          mode,
          question: value.trim(),
          history: previousTutor
            ? [{ role: "assistant", content: previousTutor.content.slice(0, 4000) }]
            : [],
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Tutor is unavailable.");
      setMessages((current) => [
        ...current,
        {
          role: "tutor",
          content: result.answer || "No response was returned.",
          citations: result.citations || [],
        },
      ]);
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
    setMessages([]);
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
      className="fixed inset-x-3 bottom-3 z-50 flex max-h-[88vh] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1110] shadow-2xl sm:left-auto sm:right-5 sm:w-[34rem]"
      aria-label="SMN Course Tutor"
    >
      <header className="shrink-0 border-b border-white/10 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-widest text-mint uppercase">Course-aware AI</p>
            <h2 className="mt-1 font-display text-xl text-white">SMN Tutor</h2>
          </div>
          <button className="text-white/60 hover:text-white" onClick={() => setOpen(false)} type="button" aria-label="Close Tutor">
            Close
          </button>
        </div>
        <p className="mt-3 rounded-lg border border-mint/20 bg-mint/5 px-3 py-2 text-xs text-mint/90">
          Grounded in this lesson · AI can be wrong — review before acting
        </p>
      </header>

      <div className="shrink-0 space-y-3 border-b border-white/10 px-4 py-3">
        <div className="flex gap-1 rounded-full bg-white/5 p-1">
          {intents.map((item) => (
            <button
              key={item.id}
              type="button"
              className={cn(
                "flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition",
                intent === item.id ? "bg-mint text-[#07110c]" : "text-white/60 hover:text-white",
              )}
              onClick={() => setIntent(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {intentConfig.modes.map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] transition",
                mode === value ? "bg-white/15 text-white" : "bg-white/5 text-white/50 hover:text-white/80",
              )}
              onClick={() => setModeByIntent((current) => ({ ...current, [intent]: value }))}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div ref={threadRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {!messages.length ? (
          <div className="space-y-2">
            <p className="text-xs text-white/45">Try one of these:</p>
            {suggestions.map((item, index) => (
              <button
                key={item}
                className={cn(
                  "w-full rounded-lg border p-3 text-left text-sm transition",
                  index === 0
                    ? "border-mint/40 bg-mint/10 text-white hover:border-mint/60"
                    : "border-white/10 text-white/70 hover:border-mint/40",
                )}
                onClick={() => void ask(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
        ) : null}

        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={cn(
              "rounded-xl p-3 text-sm leading-relaxed",
              message.role === "member" ? "ml-6 bg-deep-blue/40 text-white" : "mr-2 bg-white/[.04] text-white/75",
            )}
          >
            <p className="mb-1 text-[10px] tracking-wider text-white/35 uppercase">
              {message.role === "member" ? "You" : "Tutor"}
            </p>
            {message.role === "tutor" ? <AiMarkdown content={message.content} /> : <p className="whitespace-pre-wrap">{message.content}</p>}
            {message.role === "tutor" && message.citations?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {message.citations.map((source) => (
                  <a
                    key={source.id}
                    className="rounded-full border border-mint/25 bg-mint/10 px-2.5 py-1 text-[11px] text-mint hover:bg-mint/15"
                    href={source.href}
                  >
                    {source.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        ))}

        {busy ? (
          <div className="mr-2 rounded-xl bg-white/[.04] p-3" aria-live="polite">
            <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
            <div className="mt-3 h-3 w-full animate-pulse rounded bg-white/10" />
            <div className="mt-2 h-3 w-[70%] animate-pulse rounded bg-white/10" />
          </div>
        ) : null}

        {error ? (
          <p className="text-sm text-red-300" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <div className="shrink-0 border-t border-white/10 p-4">
        <label className="block text-sm text-white/70">
          Your question
          <textarea
            className="mt-2 min-h-20 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-white"
            maxLength={12000}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                void ask();
              }
            }}
            value={question}
            placeholder="Ask about this lesson…"
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
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
          {lastTutor ? (
            <div className="ml-auto flex items-center gap-2 text-xs text-white/50">
              <span>Helpful?</span>
              <button onClick={() => void rate("helpful")} type="button" className="hover:text-mint">
                Yes
              </button>
              <button onClick={() => void rate("not-helpful")} type="button" className="hover:text-red-200">
                No
              </button>
              {feedback ? <span aria-live="polite">{feedback}</span> : null}
            </div>
          ) : null}
        </div>
        <p className="mt-2 text-[11px] text-white/30">Esc closes · Ctrl/⌘+Enter sends</p>
      </div>
    </aside>
  );
}
