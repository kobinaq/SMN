"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";

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

type Conversation = { role: "member" | "coach"; content: string };
const panel = "rounded-2xl border border-white/10 bg-surface p-5 sm:p-6";
const input = "w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/30";

export function CareerCoach({ initial }: { initial: Snapshot }) {
  const [goal, setGoal] = useState(initial.state?.goalSummary || initial.profile.goals || "");
  const [savedGoal, setSavedGoal] = useState(initial.state?.goalSummary || "");
  const [plan, setPlan] = useState(() => initial.state?.confirmedPlan ? JSON.stringify(initial.state.confirmedPlan, null, 2) : "");
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState<Conversation[]>([]);
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const topGaps = useMemo(() => {
    const counts = new Map<string, number>();
    initial.matches.slice(0, 8).flatMap((item) => item.gaps).forEach((gap) => counts.set(gap, (counts.get(gap) || 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([gap]) => gap);
  }, [initial.matches]);

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
    setBusy(`match:${match.id}`); setError("");
    try {
      const result = await request({ action: "explain-match", opportunityId: match.id });
      setExplanations((current) => ({ ...current, [String(match.id)]: result.answer || "" }));
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not explain this match."); }
    finally { setBusy(""); }
  }

  async function chat() {
    const message = question.trim(); if (!message) return;
    setBusy("chat"); setError(""); setQuestion("");
    setConversation((current) => [...current, { role: "member", content: message }]);
    try {
      const result = await request({ action: "chat", message });
      setConversation((current) => [...current, { role: "coach", content: result.answer || "No response was returned." }]);
      setNotice(result.notice || "");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Career Coach is unavailable."); }
    finally { setBusy(""); }
  }

  async function saveGoal() {
    if (!goal.trim() || !window.confirm("Save this career goal to your private Career Coach data?")) return;
    setBusy("goal"); setError("");
    try { await request({ action: "save-goal", goal: goal.trim(), confirmed: true }); setSavedGoal(goal.trim()); setNotice("Career goal saved."); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Could not save your goal."); }
    finally { setBusy(""); }
  }

  async function savePlan() {
    if (!plan.trim() || !window.confirm("Save this plan to your private Career Coach data?")) return;
    let value: unknown = plan.trim();
    try { value = JSON.parse(plan); } catch { /* Plain-text plans are valid. */ }
    setBusy("plan"); setError("");
    try { await request({ action: "save-plan", plan: value, confirmed: true }); setNotice("Career plan saved."); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Could not save your plan."); }
    finally { setBusy(""); }
  }

  async function clearData(deleteUsage: boolean) {
    const message = deleteUsage
      ? "Delete your saved Career Coach data, AI feedback, and retained usage records? This cannot be undone."
      : "Reset your saved Career Coach goal and plan? This cannot be undone.";
    if (!window.confirm(message)) return;
    setBusy("reset"); setError("");
    try {
      await request({ action: deleteUsage ? "delete-data" : "reset", confirmed: true });
      setGoal(""); setSavedGoal(""); setPlan(""); setConversation([]); setExplanations({});
      setNotice(deleteUsage ? "Career Coach data and retained AI records deleted." : "Career Coach data reset.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not reset Career Coach data."); }
    finally { setBusy(""); }
  }

  async function rate(rating: "helpful" | "not-helpful") {
    await fetch("/api/ai/feedback", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ feature: "career-coach", contextKey: "workspace", rating }) });
    setNotice("Thanks for the feedback.");
  }

  return <div className="space-y-6 sm:space-y-8">
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-[10px] font-medium uppercase tracking-[0.22em] text-mint">Private AI workspace</p><h1 className="mt-3 font-display text-3xl text-white">Career Coach</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">Explore evidence-based opportunity matches, skill gaps, and practical next steps. Recommendations are guidance, not employment decisions or guarantees.</p></div>
      <Button href="/app/profile" variant="secondary">Improve profile inputs</Button>
    </header>

    {(error || notice) ? <div aria-live="polite" className={`rounded-xl border px-4 py-3 text-sm ${error ? "border-red-400/30 bg-red-400/10 text-red-200" : "border-mint/25 bg-mint/10 text-mint"}`}>{error || notice}</div> : null}

    <section className={panel}><p className="text-xs font-semibold uppercase tracking-wider text-baby-blue">Your direction</p><h2 className="mt-2 font-display text-xl text-white">Goal summary</h2><textarea className={`${input} mt-4 min-h-28 resize-y`} maxLength={5000} value={goal} onChange={(event) => setGoal(event.target.value)} placeholder="What kind of work are you aiming for, and what matters most?"/><div className="mt-3 flex flex-wrap items-center gap-3"><Button type="button" onClick={() => void saveGoal()} disabled={busy === "goal" || !goal.trim()}>{busy === "goal" ? "Saving…" : "Confirm and save goal"}</Button>{savedGoal ? <span className="text-xs text-white/40">A private saved goal is active.</span> : null}</div></section>

    <div className="grid gap-6 lg:grid-cols-[1.45fr_.75fr]">
      <section className={panel}><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-baby-blue">Transparent ranking</p><h2 className="mt-2 font-display text-xl text-white">Recommended opportunities</h2></div><Link className="text-xs text-mint hover:underline" href="/app/opportunities">View all</Link></div><p className="mt-2 text-xs leading-relaxed text-white/40">Scores come from inspectable overlap in your profile, learning, certificates, portfolios, and location—not an AI hiring decision.</p><div className="mt-5 grid gap-4">{initial.matches.slice(0, 6).map((match) => <article key={match.id} className="rounded-xl border border-white/10 bg-black/15 p-4"><div className="flex items-start justify-between gap-4"><div><h3 className="font-medium text-white">{match.title}</h3><p className="text-sm text-white/45">{match.company}</p></div><span className="rounded-full bg-baby-blue/10 px-2.5 py-1 text-xs text-baby-blue">{match.score}/100</span></div><p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/55">{match.summary}</p>{match.matches.length ? <p className="mt-3 text-xs text-white/45"><span className="text-mint">Evidence:</span> {match.matches.join(", ")}</p> : null}<div className="mt-4 flex flex-wrap gap-3"><Link className="text-sm text-baby-blue hover:underline" href={`/app/opportunities/${match.slug}`}>Open listing</Link><button className="text-sm text-white/55 hover:text-white disabled:opacity-50" type="button" disabled={busy === `match:${match.id}`} onClick={() => void explain(match)}>{busy === `match:${match.id}` ? "Explaining…" : "Explain match"}</button></div>{explanations[String(match.id)] ? <p className="mt-4 whitespace-pre-wrap rounded-lg bg-white/[.04] p-3 text-sm leading-relaxed text-white/65">{explanations[String(match.id)]}</p> : null}</article>)}{!initial.matches.length ? <p className="text-sm text-white/50">No published opportunities are available to rank yet.</p> : null}</div></section>

      <div className="space-y-6"><section className={panel}><p className="text-xs font-semibold uppercase tracking-wider text-baby-blue">Skill signals</p><h2 className="mt-2 font-display text-xl text-white">Common gaps</h2><div className="mt-4 flex flex-wrap gap-2">{topGaps.map((gap) => <span key={gap} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/60">{gap}</span>)}{!topGaps.length ? <p className="text-sm text-white/45">Add skills and goals to your profile for stronger gap analysis.</p> : null}</div></section><section className={panel}><p className="text-xs font-semibold uppercase tracking-wider text-baby-blue">Proof of work</p><h2 className="mt-2 font-display text-xl text-white">Portfolio guidance</h2><p className="mt-3 text-sm leading-relaxed text-white/55">Keep two or three public projects outcome-focused: state the problem, your decisions, evidence, and measurable result.</p><div className="mt-4 grid gap-2">{initial.portfolios.map((item) => <Link key={item.id} className="text-sm text-mint hover:underline" href="/app/portfolio">{item.title}</Link>)}{!initial.portfolios.length ? <Button className="mt-2" href="/app/portfolio" variant="secondary">Build a portfolio item</Button> : null}</div></section></div>
    </div>

    <div className="grid gap-6 lg:grid-cols-2"><section className={panel}><p className="text-xs font-semibold uppercase tracking-wider text-baby-blue">Learning path</p><h2 className="mt-2 font-display text-xl text-white">Suggested next learning</h2><div className="mt-4 grid gap-3">{initial.learning.slice(0, 6).map((course) => <Link key={course.id} href={`/app/learning/courses/${course.slug}`} className="rounded-xl border border-white/10 p-4 transition hover:border-baby-blue/40"><h3 className="text-sm font-medium text-white">{course.title}</h3>{course.summary ? <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/45">{course.summary}</p> : null}</Link>)}{!initial.learning.length ? <p className="text-sm text-white/45">You are enrolled in every currently available course.</p> : null}</div></section><section className={panel}><p className="text-xs font-semibold uppercase tracking-wider text-baby-blue">Confirmed actions</p><h2 className="mt-2 font-display text-xl text-white">Career plan</h2><p className="mt-2 text-xs leading-relaxed text-white/40">Paste or edit a plan here. Nothing is saved until you confirm.</p><textarea className={`${input} mt-4 min-h-48 resize-y font-mono text-xs`} value={plan} onChange={(event) => setPlan(event.target.value)} placeholder={'30-day plan\n1. Update portfolio case study\n2. Complete relevant course\n3. Apply thoughtfully'}/><Button className="mt-3" type="button" onClick={() => void savePlan()} disabled={busy === "plan" || !plan.trim()}>{busy === "plan" ? "Saving…" : "Confirm and save plan"}</Button></section></div>

    <section className={panel}><p className="text-xs font-semibold uppercase tracking-wider text-mint">Conversation</p><h2 className="mt-2 font-display text-xl text-white">Ask for practical guidance</h2><div className="mt-4 max-h-96 space-y-3 overflow-y-auto">{conversation.map((item, index) => <div key={index} className={`max-w-3xl rounded-xl p-4 text-sm leading-relaxed ${item.role === "member" ? "ml-auto bg-deep-blue/35 text-white" : "bg-white/[.04] text-white/70"}`}><p className="mb-1 text-[10px] uppercase tracking-wider text-white/35">{item.role === "member" ? "You" : "Career Coach"}</p><p className="whitespace-pre-wrap">{item.content}</p></div>)}{!conversation.length ? <p className="text-sm text-white/45">Try: “Help me turn my strongest match into a realistic four-week preparation plan.”</p> : null}</div><div className="mt-4 flex flex-col gap-3 sm:flex-row"><textarea className={`${input} min-h-20 flex-1 resize-y`} value={question} maxLength={12000} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void chat(); } }} placeholder="Ask about a role, skill gap, portfolio, or next step…"/><Button type="button" onClick={() => void chat()} disabled={busy === "chat" || !question.trim()}>{busy === "chat" ? "Thinking…" : "Ask Coach"}</Button></div>{conversation.some((item) => item.role === "coach") ? <div className="mt-4 flex items-center gap-3 text-xs text-white/45"><span>Was this useful?</span><button type="button" onClick={() => void rate("helpful")} className="hover:text-mint">Yes</button><button type="button" onClick={() => void rate("not-helpful")} className="hover:text-red-200">No</button></div> : null}</section>

    <section className={`${panel} border-amber-200/15`}><p className="text-xs font-semibold uppercase tracking-wider text-amber-100/70">Privacy and data controls</p><p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/50">Only the minimum profile, learning, credential, public portfolio, and published opportunity context needed for your request is sent to the configured AI provider. Full prompts and answers are not stored in usage logs. Saved goals and plans remain private.</p><div className="mt-4 flex flex-wrap gap-3"><Button type="button" variant="secondary" disabled={busy === "reset"} onClick={() => void clearData(false)}>Reset saved Coach data</Button><button type="button" disabled={busy === "reset"} onClick={() => void clearData(true)} className="rounded-full border border-red-300/25 px-4 py-2 text-sm text-red-200 hover:bg-red-300/10">Delete Coach and retained AI data</button></div></section>
  </div>;
}
