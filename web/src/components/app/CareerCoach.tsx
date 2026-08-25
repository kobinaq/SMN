"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ListPlus, Lock } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import { Card, Eyebrow } from "@/components/ui/Surface";
import { Input, Textarea } from "@/components/ui/Field";
import { Chip } from "@/components/ui/Chip";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import {
  AiComposer,
  AiFeedback,
  AiHeader,
  AiSuggestions,
  AiThread,
  type AiMessage,
} from "@/components/ai/AiPanel";

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

/** Coach replies that contain a step list can be pushed into the plan checklist. */
type CoachMessage = AiMessage & { offerAsPlan?: boolean };

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

const BULLET_MARKER = /^(\d+[.)]|[-*•–])\s+/;
const LABEL_MARKER = /^(week|day|step|phase)\s*\d+\b/i;

/**
 * Pull only the actionable step lines out of a coach reply — numbered/bulleted
 * items, or "Week/Day/Step N" lines — so intros, titles, and trailing prose
 * (e.g. "Here is a focused 3-step plan:") are not added to the checklist.
 */
function extractPlanSteps(content: string): string[] {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const bulleted = lines.filter((line) => BULLET_MARKER.test(line));
  // Prefer explicit bullet/number lists; fall back to Week/Day/Step labels.
  const chosen = bulleted.length ? bulleted : lines.filter((line) => LABEL_MARKER.test(line));
  return chosen
    .map((line) =>
      line
        .replace(/^#+\s*/, "")
        .replace(BULLET_MARKER, "")
        .replace(/\*\*/g, "")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter((line) => line.length > 3 && line.length < 220)
    .slice(0, 12);
}

export function CareerCoach({ initial }: { initial: Snapshot }) {
  const [goal, setGoal] = useState(initial.state?.goalSummary || initial.profile.goals || "");
  const [savedGoal, setSavedGoal] = useState(initial.state?.goalSummary || "");
  const [goalOpen, setGoalOpen] = useState(!initial.state?.goalSummary);
  const [planItems, setPlanItems] = useState<string[]>(() => planToLines(initial.state?.confirmedPlan));
  const [newPlanItem, setNewPlanItem] = useState("");
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState<CoachMessage[]>([]);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [pendingClear, setPendingClear] = useState<null | { deleteUsage: boolean }>(null);
  const toast = useToast();

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
        { role: "assistant", content: answer, offerAsPlan: extractPlanSteps(answer).length >= 2 },
      ]);
      if (result.notice) toast.push(result.notice, "info");
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
        { role: "assistant", content: answer, offerAsPlan: extractPlanSteps(answer).length >= 2 },
      ]);
      if (result.notice) toast.push(result.notice, "info");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Career Coach is unavailable.");
    } finally {
      setBusy("");
    }
  }

  async function saveGoal() {
    if (!goal.trim()) return;
    setBusy("goal");
    setError("");
    try {
      await request({ action: "save-goal", goal: goal.trim(), confirmed: true });
      setSavedGoal(goal.trim());
      toast.push("Career goal saved.", "success");
      setGoalOpen(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save your goal.");
    } finally {
      setBusy("");
    }
  }

  async function savePlan() {
    const lines = planItems.map((item) => item.trim()).filter(Boolean);
    if (!lines.length) return;
    setBusy("plan");
    setError("");
    try {
      await request({ action: "save-plan", plan: lines, confirmed: true });
      toast.push("Career plan saved.", "success");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save your plan.");
    } finally {
      setBusy("");
    }
  }

  // Append only the actionable steps from a coach reply (not titles/prose),
  // and never overwrite the existing plan.
  function addToPlan(content: string) {
    const steps = extractPlanSteps(content);
    if (!steps.length) return;
    const existing = new Set(planItems.map((line) => line.trim().toLowerCase()));
    const additions = steps.filter((line) => !existing.has(line.toLowerCase()));
    if (!additions.length) {
      toast.push("Those steps are already in your plan.", "info");
      return;
    }
    setPlanItems((current) => [...current, ...additions]);
    toast.push(
      `Added ${additions.length} step${additions.length > 1 ? "s" : ""} to your plan — review and save.`,
      "success",
    );
  }

  async function copyMessage(content: string) {
    try {
      await navigator.clipboard.writeText(content);
      toast.push("Copied to clipboard.", "success");
    } catch {
      toast.push("Couldn’t copy — select and copy manually.", "error");
    }
  }

  async function confirmClear() {
    if (!pendingClear) return;
    const { deleteUsage } = pendingClear;
    setBusy("reset");
    setError("");
    try {
      await request({ action: deleteUsage ? "delete-data" : "reset", confirmed: true });
      setGoal("");
      setSavedGoal("");
      setPlanItems([]);
      setConversation([]);
      toast.push(
        deleteUsage ? "Career Coach data and retained AI records deleted." : "Career Coach data reset.",
        "success",
      );
      setPendingClear(null);
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
    toast.push("Thanks for the feedback.", "success");
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Eyebrow tone="ai">Private AI workspace</Eyebrow>
            <Chip tone="ai" icon={<Lock className="h-3 w-3" aria-hidden />}>
              Private to you
            </Chip>
          </div>
          <h1 className="mt-2 font-display text-2xl text-text-1 sm:text-3xl">Career Coach</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-2">
            Ask for practical next steps. Matches and gaps stay visible so guidance stays grounded in your profile —
            not hiring decisions.
          </p>
        </div>
        <Button href="/app/profile" variant="secondary">
          Improve profile inputs
        </Button>
      </header>

      {error ? (
        <div
          aria-live="polite"
          className="rounded-[var(--radius-md)] bg-danger-bg px-4 py-3 text-sm text-danger"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)] lg:items-start">
        {/* Left rail — the grounding inputs the Coach reasons over */}
        <aside className="rise-stagger space-y-4 lg:sticky lg:top-4">
          <Card style={{ "--i": 0 } as React.CSSProperties}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 text-left"
              onClick={() => setGoalOpen((value) => !value)}
              aria-expanded={goalOpen}
            >
              <div>
                <Eyebrow>Your direction</Eyebrow>
                <h2 className="mt-1 font-display text-lg text-text-1">Goal</h2>
              </div>
              <span className="text-xs text-text-3">{goalOpen ? "Hide" : "Edit"}</span>
            </button>
            {!goalOpen && savedGoal ? (
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-text-2">{savedGoal}</p>
            ) : null}
            {goalOpen ? (
              <div className="mt-3 space-y-3">
                <Textarea
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
          </Card>

          <Card style={{ "--i": 1 } as React.CSSProperties}>
            <div className="flex items-end justify-between gap-3">
              <div>
                <Eyebrow>Matches</Eyebrow>
                <h2 className="mt-1 font-display text-lg text-text-1">Top opportunities</h2>
              </div>
              <Link className="text-xs text-ai hover:underline" href="/app/opportunities">
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-2">
              {initial.matches.slice(0, 4).map((match) => (
                <article
                  key={match.id}
                  className="rounded-[var(--radius-md)] border border-edge-subtle bg-inset p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-medium text-text-1">{match.title}</h3>
                      <p className="truncate text-xs text-text-3">{match.company}</p>
                    </div>
                    <span className="tnum shrink-0 rounded-full bg-accent-bg px-2 py-0.5 text-xs font-medium text-accent">
                      {match.score}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <Link className="text-xs text-accent hover:underline" href={`/app/opportunities/${match.slug}`}>
                      Open
                    </Link>
                    <button
                      type="button"
                      className="text-xs text-text-2 transition-colors hover:text-text-1 disabled:opacity-50"
                      disabled={busy === `match:${match.id}`}
                      onClick={() => void explain(match)}
                    >
                      {busy === `match:${match.id}` ? "Explaining…" : "Explain in chat"}
                    </button>
                  </div>
                </article>
              ))}
              {!initial.matches.length ? (
                <p className="text-sm text-text-3">No published opportunities to rank yet.</p>
              ) : null}
            </div>
          </Card>

          <Card style={{ "--i": 2 } as React.CSSProperties}>
            <Eyebrow>Gaps</Eyebrow>
            <h2 className="mt-1 font-display text-lg text-text-1">Common skill gaps</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {topGaps.map((gap) => (
                <button
                  key={gap}
                  type="button"
                  onClick={() => void chat(`How do I close my gap around “${gap}” with concrete proof of work?`)}
                  className="transition-transform duration-[var(--dur-fast)] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
                >
                  <Chip tone="warn">{gap}</Chip>
                </button>
              ))}
              {!topGaps.length ? (
                <p className="text-sm text-text-3">Add skills and goals for stronger gap analysis.</p>
              ) : null}
            </div>
          </Card>

          <Card style={{ "--i": 3 } as React.CSSProperties}>
            <Eyebrow>Plan</Eyebrow>
            <h2 className="mt-1 font-display text-lg text-text-1">Action checklist</h2>
            <ul className="mt-3 space-y-1.5">
              {planItems.map((item, index) => (
                <li key={`${item}-${index}`} className="flex items-start gap-2">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ai" />
                  <input
                    className="min-w-0 flex-1 rounded-[var(--radius-sm)] border border-transparent bg-transparent px-1.5 py-1 text-sm text-text-2 outline-none transition-colors hover:border-edge-subtle focus:border-accent focus:text-text-1"
                    value={item}
                    onChange={(event) =>
                      setPlanItems((current) =>
                        current.map((line, lineIndex) => (lineIndex === index ? event.target.value : line)),
                      )
                    }
                  />
                  <button
                    type="button"
                    className="mt-1 text-xs text-text-3 transition-colors hover:text-danger"
                    onClick={() => setPlanItems((current) => current.filter((_, lineIndex) => lineIndex !== index))}
                    aria-label="Remove plan item"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <Input
              className="mt-3"
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
            <Button
              className="mt-3"
              type="button"
              onClick={() => void savePlan()}
              disabled={busy === "plan" || !planItems.some((item) => item.trim())}
            >
              {busy === "plan" ? "Saving…" : "Confirm and save plan"}
            </Button>
          </Card>
        </aside>

        {/* Conversation — same shell the Tutor uses, mounted inline */}
        <Card
          padded={false}
          className="flex min-h-[70vh] flex-col overflow-hidden lg:min-h-[calc(100svh-8rem)]"
        >
          <AiHeader
            eyebrow="Conversation"
            title="Ask for practical guidance"
            grounding="Grounded in your profile · AI can be wrong — review before acting"
          />

          <AiThread
            messages={conversation.map((item) =>
              item.role === "assistant" && item.offerAsPlan
                ? {
                    ...item,
                    action: {
                      label: "Add to plan",
                      icon: <ListPlus className="h-3.5 w-3.5" aria-hidden />,
                      onClick: () => addToPlan(item.content),
                    },
                  }
                : item,
            )}
            busy={busy === "chat" || busy.startsWith("match:")}
            onCopy={copyMessage}
            empty={
              <div className="space-y-4">
                <div className="rounded-[var(--radius-md)] border border-edge-subtle bg-inset p-4">
                  <p className="text-sm font-medium text-text-1">What the Coach can do</p>
                  <p className="mt-1 text-sm leading-relaxed text-text-2">
                    Build preparation plans, close skill gaps with proof-of-work ideas, and prioritize profile
                    improvements — always tied to your real matches. It won’t make hiring decisions or guarantee
                    outcomes.
                  </p>
                </div>
                <AiSuggestions
                  title="Start with a focused ask, or pick a prompt"
                  suggestions={starterPrompts}
                  onPick={(prompt) => void chat(prompt)}
                />
              </div>
            }
          />

          <AiComposer
            value={question}
            onChange={setQuestion}
            onSubmit={() => void chat()}
            busy={busy === "chat"}
            submitLabel="Ask Coach"
            placeholder="Ask about a role, skill gap, portfolio, or next step…"
            footer={
              conversation.some((item) => item.role === "assistant") ? (
                <AiFeedback onRate={(rating) => void rate(rating)} />
              ) : null
            }
          />
        </Card>
      </div>

      <footer className="rounded-[var(--radius-md)] border border-edge-subtle px-4 py-3 text-xs leading-relaxed text-text-3">
        <p>
          Only the minimum profile, learning, credential, portfolio, and opportunity context needed for your request is
          sent to the AI provider. Full prompts and answers are not stored in usage logs.
        </p>
        <div className="mt-2 flex flex-wrap gap-4">
          <button
            type="button"
            disabled={busy === "reset"}
            onClick={() => setPendingClear({ deleteUsage: false })}
            className="text-text-2 transition-colors hover:text-text-1"
          >
            Reset saved Coach data
          </button>
          <button
            type="button"
            disabled={busy === "reset"}
            onClick={() => setPendingClear({ deleteUsage: true })}
            className="text-danger/80 transition-colors hover:text-danger"
          >
            Delete Coach and retained AI data
          </button>
          {initial.learning[0] ? (
            <Link className="text-ai/80 transition-colors hover:text-ai" href={`/app/learning/courses/${initial.learning[0].slug}`}>
              Suggested learning: {initial.learning[0].title}
            </Link>
          ) : null}
        </div>
      </footer>

      <ConfirmDialog
        open={pendingClear !== null}
        title={pendingClear?.deleteUsage ? "Delete Coach and retained AI data?" : "Reset saved Coach data?"}
        description={
          pendingClear?.deleteUsage
            ? "This permanently deletes your saved goal, plan, AI feedback, and retained usage records. This cannot be undone."
            : "This clears your saved goal and plan. This cannot be undone."
        }
        confirmLabel={pendingClear?.deleteUsage ? "Delete data" : "Reset data"}
        destructive
        busy={busy === "reset"}
        onClose={() => busy !== "reset" && setPendingClear(null)}
        onConfirm={confirmClear}
      />
    </div>
  );
}
