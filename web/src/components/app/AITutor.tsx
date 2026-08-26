"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles, X } from "@/components/ui/icons";
import { Chip } from "@/components/ui/Chip";
import { Segmented } from "@/components/ui/Segmented";
import { useToast } from "@/components/ui/Toast";
import {
  AiComposer,
  AiFeedback,
  AiHeader,
  AiSuggestions,
  AiThread,
  type AiMessage,
} from "@/components/ai/AiPanel";
import { cn } from "@/lib/utils";

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

const intents: Array<{ value: Intent; label: string; modes: Array<[TutorMode, string]> }> = [
  {
    value: "study",
    label: "Study",
    modes: [
      ["explain", "Explain"],
      ["simplify", "Simplify"],
      ["summary", "Summarize"],
    ],
  },
  {
    value: "practice",
    label: "Practice",
    modes: [
      ["example", "Example"],
      ["revision", "Revision"],
      ["feedback", "Feedback"],
      ["socratic", "Guide me"],
    ],
  },
  {
    value: "navigate",
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
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const toast = useToast();

  const mode = modeByIntent[intent];
  const intentConfig = intents.find((item) => item.value === intent)!;
  const hasAnswer = useMemo(() => messages.some((message) => message.role === "assistant"), [messages]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function copyMessage(content: string) {
    try {
      await navigator.clipboard.writeText(content);
      toast.push("Copied to clipboard.", "success");
    } catch {
      toast.push("Couldn’t copy — select the text manually.", "error");
    }
  }

  async function ask(value = question) {
    if (!value.trim() || busy) return;
    const previousAnswer = [...messages].reverse().find((message) => message.role === "assistant");
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
          history: previousAnswer ? [{ role: "assistant", content: previousAnswer.content.slice(0, 4000) }] : [],
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Tutor is unavailable.");
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
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
      body: JSON.stringify({ feature: "tutor", contextKey: `course:${courseId}:lesson:${lessonId}`, rating }),
    });
    setFeedback("Thanks.");
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "fixed right-5 bottom-5 z-40 inline-flex items-center gap-2 rounded-full bg-ai px-5 py-3",
          "text-sm font-semibold text-[#07160f] shadow-[var(--shadow-2)]",
          "transition-transform duration-[var(--dur-base)] ease-[var(--ease-spring)]",
          "hover:scale-105 active:scale-95 motion-reduce:hover:scale-100",
        )}
      >
        <Sparkles className="h-4 w-4" aria-hidden />
        Ask SMN Tutor
      </button>
    );
  }

  return (
    <aside
      aria-label="SMN Course Tutor"
      className={cn(
        "fixed inset-x-3 bottom-3 z-50 flex max-h-[88vh] flex-col overflow-hidden",
        "rounded-[var(--radius-xl)] border border-edge bg-raised shadow-[var(--shadow-3)]",
        "sm:right-5 sm:left-auto sm:w-[34rem]",
        "animate-[rise-in_var(--dur-base)_var(--ease-out)_both]",
      )}
    >
      <AiHeader
        eyebrow="Course-aware AI"
        title="SMN Tutor"
        grounding="Grounded in this lesson · AI can be wrong — review before acting"
        action={
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close Tutor"
            className="rounded-[var(--radius-sm)] p-1.5 text-text-3 transition-colors hover:bg-inset hover:text-text-1"
          >
            <X className="h-4 w-4" />
          </button>
        }
      />

      <div className="shrink-0 space-y-3 border-b border-edge-subtle px-5 py-3">
        <Segmented options={intents} value={intent} onChange={setIntent} tone="ai" aria-label="Tutor intent" />
        <div className="flex flex-wrap gap-1.5">
          {intentConfig.modes.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setModeByIntent((current) => ({ ...current, [intent]: value }))}
            >
              <Chip tone={mode === value ? "ai" : "neutral"}>{label}</Chip>
            </button>
          ))}
        </div>
      </div>

      <AiThread
        messages={messages}
        busy={busy}
        error={error}
        onCopy={copyMessage}
        empty={<AiSuggestions suggestions={suggestionsByIntent[intent]} onPick={(value) => void ask(value)} />}
      />

      <AiComposer
        value={question}
        onChange={setQuestion}
        onSubmit={() => void ask()}
        busy={busy}
        placeholder="Ask about this lesson…"
        hint="Esc closes · ⌘ + Enter sends"
        footer={hasAnswer ? <AiFeedback onRate={(rating) => void rate(rating)} message={feedback} /> : null}
      />
    </aside>
  );
}
