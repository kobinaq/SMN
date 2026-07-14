"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { AiMarkdown } from "@/components/ui/AiMarkdown";
import { cn } from "@/lib/utils";

type Match = {
  id: string | number;
  title: string;
  slug: string;
  company: string;
  summary: string;
  score: number;
  matches: string[];
  gaps: string[];
  relevantLearning: string[];
};

type Snapshot = {
  profile: {
    headline?: string | null;
    skills: string[];
    goals?: string | null;
    learning: string[];
    certificates: string[];
    portfolioSkills: string[];
  };
  matches: Match[];
  learning: Array<{ id: string | number; title: string; slug: string; summary?: string | null }>;
  certificates: Array<{ id: string | number; title: string; code: string }>;
  portfolios: Array<{ id: string | number; title: string; slug: string; summary?: string | null }>;
  state: { goalSummary?: string | null; confirmedPlan?: unknown } | null;
};

type Conversation = { role: "member" | "coach"; content: string; offerAsPlan?: boolean };

const panel = "rounded-2xl border border-white/10 bg-surface p-4 sm:p-5";
const input =
  "w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/30";

function planToLines(value: unknown): string[] {
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((line) => line.replace(/^[-*•\d.)\s]+/, "").trim())
      .filter(Boolean);
  }
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>)
      .map((item) => String(item).trim())
      .filter(Boolean);
  }
  return [];
}

function looksLikePlan(content: string) {
  const lines = content.split("\n").filter((line) => line.trim());
  const bullets = lines.filter((line) => /^(\d+[.)]\s+|[-*•]\s+)/.test(line.trim())).length;
  return bullets >= 3 || /week|day\s*\d|plan|checklist/i.test(content);
}

export function CareerCoach({ initial }: { initial: Snapshot }) {
  const [goal, setGoal] = useState(initial.state?.goalSummary || initial.profile.goals || "");
  const [savedGoal, setSavedGoal] = useState(initial.state?.goalSummary || "");
  const [goalOpen, setGoalOpen] = useState(!initial.state?.goalSummary);
  const [planItems, setPlanItems] = useState<string[]>(() => planToLines(initial.state?.confirmedPlan));
  const [newPlanItem, setNewPlanItem] = useState("");
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState<Conversation[]>([]);
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);

  const topGaps = useMemo(() => {
    const counts = new Map<string, number>();
    initial.matches
      .slice(0, 8)
      .flatMap((item) => item.gaps)
      .forEach((gap) => counts.set(gap, (counts.get(gap) || 0) + 1));
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([gap]) => gap);
  }, [initial.matches]);

  const topMatch = initial.matches[0];
  const starterPrompts = useMemo(() => {
    const prompts: string[] = [];
    if (topMatch) {
      prompts.push(`Help me build a realistic 4-week preparation plan for ${topMatch.title} at ${topMatch.company}.`);
    }
    if (topGaps[0]) {
      prompts.push(`How do I close my gap around “${topGaps[0]}” with proof of work?`);
    }
    prompts.push("What should I improve on my profile first to get stronger opportunity matches?");
    return prompts.slice(0, 3);
  }, [topMatch, topGaps]);

  useEffect(() => {
    const node = threadRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [conversation, busy]);

  async function request(body: Record<string, unknown>) {
    const response = await fetch("/api/ai/career-coach", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "Career Coach is unavailable.");
    return result as { answer?: string; notice?: string };
  }

  async function explain(match: Match) {
    setBusy(`match:${match.id}`);
    setError("");
    setConversation((current) => [
      ...current,
      {
        role: "member",
        content: `Explain why “${match.title}” at ${match.company} is a fit for me.`,
      },
    ]);
    try {
      const result = await request({ action: "explain-match", opportunityId: match.id });
      const answer = result.answer || "No explanation was returned.";
      setConversation((current) => [
        ...current,
        { role: "coach", content: answer, offerAsPlan: looksLikePlan(answer) },
      ]);
      setNotice(result.notice || "");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not explain this match.");
    } finally {
      setBusy("");
    }
  }

  async function chat(messageOverride?: string) {
    const message = (messageOverride ?? question).trim();
    if (!message) return;
    setBusy("chat");
    setError("");
    setQuestion("");
    setConversation((current) => [...current, { role: "member", content: message }]);
    try {
      const result = await request({ action: "chat", message });
      const answer = result.answer || "No response was returned.";
      setConversation((current) => [
        ...current,
        { role: "coach", content: answer, offerAsPlan: looksLikePlan(answer) },
      ]);
      setNotice(result.notice || "");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Career Coach is unavailable.");
    } finally {
      setBusy("");
    }
  }

  async function saveGoal() {
    if (!goal.trim() || !window.confirm("Save this career goal to your private Career Coach data?")) return;
    setBusy("goal");
    setError("");
    try {
      await request({ action: "save-goal", goal: goal.trim(), confirmed: true });
      setSavedGoal(goal.trim());
      setNotice("Career goal saved.");
      setGoalOpen(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save your goal.");
    } finally {
      setBusy("");
    }
  }

  async function savePlan() {
    const lines = planItems.map((item) => item.trim()).filter(Boolean);
    if (!lines.length || !window.confirm("Save this plan to your private Career Coach data?")) return;
    setBusy("plan");
    setError("");
    try {
      await request({ action: "save-plan", plan: lines, confirmed: true });
      setNotice("Career plan saved.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save your plan.");
    } finally {
      setBusy("");
    }
  }

  function useAsPlan(content: string) {
    const lines = content
      .split("\n")
      .map((line) => line.replace(/^#+\s*/, "").replace(/^[-*•\d.)\s]+/, "").trim())
      .filter((line) => line.length > 3 && line.length < 220)
      .slice(0, 12);
    if (!lines.length) return;
    setPlanItems(lines);
    setNotice("Plan checklist updated — confirm and save when ready.");
  }

  async function clearData(deleteUsage: boolean) {
    const message = deleteUsage
      ? "Delete your saved Career Coach data, AI feedback, and retained usage records? This cannot be undone."
      : "Reset your saved Career Coach goal and plan? This cannot be undone.";
    if (!window.confirm(message)) return;
    setBusy("reset");
    setError("");
    try {
      await request({ action: deleteUsage ? "delete-data" : "reset", confirmed: true });
      setGoal("");
      setSavedGoal("");
      setPlanItems([]);
      setConversation([]);
      setNotice(deleteUsage ? "Career Coach data and retained AI records deleted." : "Career Coach data reset.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not reset Career Coach data.");
    } finally {
      setBusy("");
    }
  }

  async function rate(rating: "helpful" | "not-helpful") {
    await fetch("/api/ai/feedback", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ feature: "career-coach", contextKey: "workspace", rating }),
    });
    setNotice("Thanks for the feedback.");
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-medium tracking-[0.22em] text-mint uppercase">Private AI workspace</p>
          <h1 className="mt-2 font-display text-3xl text-white">Career Coach</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">
            Ask for practical next steps. Matches and gaps stay visible so guidance stays grounded in your profile —
            not hiring decisions.
          </p>
        </div>
        <Button href="/app/profile" variant="secondary">
          Improve profile inputs
        </Button>
      </header>

      {error || notice ? (
        <div
          aria-live="polite"
          className={cn(
            "rounded-xl border px-4 py-3 text-sm",
            error ? "border-red-400/30 bg-red-400/10 text-red-200" : "border-mint/25 bg-mint/10 text-mint",
          )}
        >
          {error || notice}
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:items-start">
        {/* Left rail */}
        <aside className="space-y-4 lg:sticky lg:top-20">
          <section className={panel}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 text-left"
              onClick={() => setGoalOpen((value) => !value)}
            >
              <div>
                <p className="text-[10px] font-medium tracking-[0.18em] text-baby-blue uppercase">Your direction</p>
                <h2 className="mt-1 font-display text-lg text-white">Goal</h2>
              </div>
              <span className="text-xs text-white/40">{goalOpen ? "Hide" : "Edit"}</span>
            </button>
            {!goalOpen && savedGoal ? (
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/60">{savedGoal}</p>
            ) : null}
            {goalOpen ? (
              <div className="mt-3 space-y-3">
                <textarea
                  className={`${input} min-h-24 resize-y`}
                  maxLength={5000}
                  value={goal}
                  onChange={(event) => setGoal(event.target.value)}
                  placeholder="What kind of work are you aiming for?"
                />
                <Button type="button" onClick={() => void saveGoal()} disabled={busy === "goal" || !goal.trim()}>
                  {busy === "goal" ? "Saving…" : "Confirm and save goal"}
                </Button>
              </div>
            ) : null}
          </section>

          <section className={panel}>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-medium tracking-[0.18em] text-baby-blue uppercase">Matches</p>
                <h2 className="mt-1 font-display text-lg text-white">Top opportunities</h2>
              </div>
              <Link className="text-xs text-mint hover:underline" href="/app/opportunities">
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {initial.matches.slice(0, 4).map((match) => (
                <article key={match.id} className="rounded-xl border border-white/10 bg-black/15 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-medium text-white">{match.title}</h3>
                      <p className="truncate text-xs text-white/45">{match.company}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-baby-blue/10 px-2 py-0.5 text-[10px] text-baby-blue">
                      {match.score}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link className="text-xs text-baby-blue hover:underline" href={`/app/opportunities/${match.slug}`}>
                      Open
                    </Link>
                    <button
                      type="button"
                      className="text-xs text-white/55 hover:text-white disabled:opacity-50"
                      disabled={busy === `match:${match.id}`}
                      onClick={() => void explain(match)}
                    >
                      {busy === `match:${match.id}` ? "Explaining…" : "Explain in chat"}
                    </button>
                  </div>
                </article>
              ))}
              {!initial.matches.length ? (
                <p className="text-sm text-white/45">No published opportunities to rank yet.</p>
              ) : null}
            </div>
          </section>

          <section className={panel}>
            <p className="text-[10px] font-medium tracking-[0.18em] text-baby-blue uppercase">Gaps</p>
            <h2 className="mt-1 font-display text-lg text-white">Common skill gaps</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {topGaps.map((gap) => (
                <button
                  key={gap}
                  type="button"
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/65 transition hover:border-baby-blue/40 hover:text-white"
                  onClick={() => void chat(`How do I close my gap around “${gap}” with concrete proof of work?`)}
                >
                  {gap}
                </button>
              ))}
              {!topGaps.length ? (
                <p className="text-sm text-white/45">Add skills and goals for stronger gap analysis.</p>
              ) : null}
            </div>
          </section>

          <section className={panel}>
            <p className="text-[10px] font-medium tracking-[0.18em] text-baby-blue uppercase">Plan</p>
            <h2 className="mt-1 font-display text-lg text-white">Action checklist</h2>
            <ul className="mt-3 space-y-2">
              {planItems.map((item, index) => (
                <li key={`${item}-${index}`} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mint/70" />
                  <input
                    className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-1 py-0.5 text-sm text-white/75 outline-none hover:border-white/10 focus:border-white/20"
                    value={item}
                    onChange={(event) =>
                      setPlanItems((current) =>
                        current.map((line, lineIndex) => (lineIndex === index ? event.target.value : line)),
                      )
                    }
                  />
                  <button
                    type="button"
                    className="text-xs text-white/35 hover:text-red-200"
                    onClick={() => setPlanItems((current) => current.filter((_, lineIndex) => lineIndex !== index))}
                    aria-label="Remove plan item"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2">
              <input
                className={`${input} flex-1 py-2`}
                value={newPlanItem}
                onChange={(event) => setNewPlanItem(event.target.value)}
                placeholder="Add a next step"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    if (!newPlanItem.trim()) return;
                    setPlanItems((current) => [...current, newPlanItem.trim()]);
                    setNewPlanItem("");
                  }
                }}
              />
            </div>
            <Button
              className="mt-3"
              type="button"
              onClick={() => void savePlan()}
              disabled={busy === "plan" || !planItems.some((item) => item.trim())}
            >
              {busy === "plan" ? "Saving…" : "Confirm and save plan"}
            </Button>
          </section>
        </aside>

        {/* Chat workspace */}
        <section className={`${panel} flex min-h-[70vh] flex-col lg:min-h-[calc(100svh-10rem)]`}>
          <div className="border-b border-white/10 pb-4">
            <p className="text-[10px] font-medium tracking-[0.18em] text-mint uppercase">Conversation</p>
            <h2 className="mt-1 font-display text-xl text-white">Ask for practical guidance</h2>
          </div>

          <div ref={threadRef} className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
            {!conversation.length ? (
              <div className="space-y-3 py-2">
                <p className="text-sm text-white/45">Start with a focused ask, or pick a prompt:</p>
                <div className="grid gap-2">
                  {starterPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      className="rounded-xl border border-white/10 bg-white/[.03] p-3 text-left text-sm text-white/70 transition hover:border-mint/40 hover:text-white"
                      onClick={() => void chat(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {conversation.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={cn(
                  "max-w-3xl rounded-xl p-4 text-sm leading-relaxed",
                  item.role === "member" ? "ml-auto bg-deep-blue/35 text-white" : "bg-white/[.04] text-white/70",
                )}
              >
                <p className="mb-1 text-[10px] tracking-wider text-white/35 uppercase">
                  {item.role === "member" ? "You" : "Career Coach"}
                </p>
                {item.role === "coach" ? <AiMarkdown content={item.content} /> : <p className="whitespace-pre-wrap">{item.content}</p>}
                {item.role === "coach" && item.offerAsPlan ? (
                  <button
                    type="button"
                    className="mt-3 text-xs text-mint hover:underline"
                    onClick={() => useAsPlan(item.content)}
                  >
                    Use this as my plan
                  </button>
                ) : null}
              </div>
            ))}

            {busy === "chat" || busy.startsWith("match:") ? (
              <div className="max-w-md rounded-xl bg-white/[.04] p-4" aria-live="polite">
                <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
                <div className="mt-3 h-3 w-full animate-pulse rounded bg-white/10" />
                <div className="mt-2 h-3 w-[80%] animate-pulse rounded bg-white/10" />
                <div className="mt-2 h-3 w-[65%] animate-pulse rounded bg-white/10" />
              </div>
            ) : null}
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <textarea
                className={`${input} min-h-20 flex-1 resize-y`}
                value={question}
                maxLength={12000}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void chat();
                  }
                }}
                placeholder="Ask about a role, skill gap, portfolio, or next step…"
              />
              <Button type="button" onClick={() => void chat()} disabled={busy === "chat" || !question.trim()}>
                {busy === "chat" ? "Thinking…" : "Ask Coach"}
              </Button>
            </div>
            {conversation.some((item) => item.role === "coach") ? (
              <div className="mt-3 flex items-center gap-3 text-xs text-white/45">
                <span>Was this useful?</span>
                <button type="button" onClick={() => void rate("helpful")} className="hover:text-mint">
                  Yes
                </button>
                <button type="button" onClick={() => void rate("not-helpful")} className="hover:text-red-200">
                  No
                </button>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      <footer className="rounded-xl border border-white/5 px-4 py-3 text-xs leading-relaxed text-white/40">
        <p>
          Only the minimum profile, learning, credential, portfolio, and opportunity context needed for your request is
          sent to the AI provider. Full prompts and answers are not stored in usage logs.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={busy === "reset"}
            onClick={() => void clearData(false)}
            className="text-white/55 hover:text-white"
          >
            Reset saved Coach data
          </button>
          <button
            type="button"
            disabled={busy === "reset"}
            onClick={() => void clearData(true)}
            className="text-red-200/70 hover:text-red-200"
          >
            Delete Coach and retained AI data
          </button>
          {initial.learning[0] ? (
            <Link className="text-mint/80 hover:text-mint" href={`/app/learning/courses/${initial.learning[0].slug}`}>
              Suggested learning: {initial.learning[0].title}
            </Link>
          ) : null}
        </div>
      </footer>
    </div>
  );
}
