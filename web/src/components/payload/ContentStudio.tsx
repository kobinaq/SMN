"use client";
import { useMemo, useState } from "react";
import { Copy, FileJson, Sparkles } from "@/components/ui/icons";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/Feedback";
import { AiMarkdown } from "@/components/ui/AiMarkdown";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { assessmentCreateDataFromStudio } from "@/lib/lms-gradebook";

type ID = string | number;
type Provenance = { provider: string; model: string; generatedAt: string };
type Candidate = { id: string; content: unknown; provenance: Provenance; selected?: boolean };

const kinds = [
  "course-outline",
  "lesson-outline",
  "lesson",
  "example",
  "quiz",
  "rubric",
  "revision",
  "faq",
] as const;
type Kind = (typeof kinds)[number];

const kindLabel: Record<Kind, string> = {
  "course-outline": "Course outline",
  "lesson-outline": "Lesson outline",
  lesson: "Lesson draft",
  example: "Worked example",
  quiz: "Quiz",
  rubric: "Rubric",
  revision: "Revision notes",
  faq: "FAQ",
};

const isStructuredKind = (kind: Kind) =>
  kind === "quiz" || kind === "rubric" || kind === "course-outline" || kind === "lesson-outline";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

const card = "rounded-[var(--radius-lg)] border border-edge-subtle bg-inset p-4";
const field =
  "mt-1 w-full rounded-[var(--radius-md)] border border-edge-subtle bg-black/20 px-3 py-2 text-sm text-text-1 placeholder:text-text-3";
const labelCls = "block text-xs font-medium text-text-2";

/* ---------- structured preview shapes (loose; content is unknown from the API) ---------- */
type OutlineSection = { heading?: string; summary?: string; minutes?: number };
type LessonOutline = { title?: string; objectives?: string[]; sections?: OutlineSection[]; assessmentIdea?: string };
type CourseLesson = { title?: string; summary?: string; lessonType?: string; durationMinutes?: number };
type CourseModule = { title?: string; summary?: string; lessons?: CourseLesson[] };
type CourseOutline = {
  title?: string;
  summary?: string;
  level?: string;
  learningOutcomes?: string[];
  modules?: CourseModule[];
};
type QuizQuestion = {
  prompt?: string;
  type?: string;
  options?: string[];
  answer?: string;
  rationale?: string;
  marks?: number;
};
type Quiz = { title?: string; instructions?: string; questions?: QuizQuestion[]; totalMarks?: number };
type RubricLevel = { label?: string; descriptor?: string; marks?: number };
type RubricCriterion = { criterion?: string; description?: string; levels?: RubricLevel[] };
type Rubric = { title?: string; criteria?: RubricCriterion[]; totalMarks?: number };

const eyebrow = "eyebrow text-accent";

function CandidatePreview({ kind, content }: { kind: Kind; content: unknown }) {
  // Text drafts (lesson / example / revision / faq) arrive as Markdown strings.
  if (typeof content === "string") {
    return content.trim() ? (
      <AiMarkdown content={content} />
    ) : (
      <p className="text-sm text-text-3">Empty draft.</p>
    );
  }
  if (!isRecord(content)) {
    return <pre className="overflow-auto text-xs text-text-2">{JSON.stringify(content, null, 2)}</pre>;
  }

  if (kind === "quiz") {
    const quiz = content as Quiz;
    return (
      <div className="space-y-3">
        {quiz.title ? <h4 className="font-display text-base text-text-1">{quiz.title}</h4> : null}
        {quiz.instructions ? <p className="text-sm text-text-2">{quiz.instructions}</p> : null}
        <ol className="space-y-2">
          {(quiz.questions ?? []).map((q, index) => (
            <li key={index} className={card}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase tracking-wider text-text-3">
                  Q{index + 1} · {q.type}
                </span>
                {typeof q.marks === "number" ? <span className="text-xs text-ai">{q.marks} marks</span> : null}
              </div>
              <p className="mt-1 text-sm text-text-1">{q.prompt}</p>
              {q.options?.length ? (
                <ul className="mt-2 space-y-1 text-sm text-text-2">
                  {q.options.map((option, optionIndex) => (
                    <li key={optionIndex} className="flex gap-2">
                      <span className="text-text-3">{String.fromCharCode(65 + optionIndex)}.</span>
                      {option}
                    </li>
                  ))}
                </ul>
              ) : null}
              {q.answer ? <p className="mt-2 text-xs text-ai">Answer: {q.answer}</p> : null}
              {q.rationale ? <p className="mt-1 text-xs text-text-3">{q.rationale}</p> : null}
            </li>
          ))}
        </ol>
        {typeof quiz.totalMarks === "number" ? (
          <p className="text-xs text-text-3">Total marks: {quiz.totalMarks}</p>
        ) : null}
      </div>
    );
  }

  if (kind === "rubric") {
    const rubric = content as Rubric;
    return (
      <div className="space-y-3">
        {rubric.title ? <h4 className="font-display text-base text-text-1">{rubric.title}</h4> : null}
        {(rubric.criteria ?? []).map((criterion, index) => (
          <div key={index} className={card}>
            <p className="text-sm font-medium text-text-1">{criterion.criterion}</p>
            {criterion.description ? (
              <p className="mt-1 text-xs text-text-2">{criterion.description}</p>
            ) : null}
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {(criterion.levels ?? []).map((level, levelIndex) => (
                <div key={levelIndex} className="rounded-lg border border-edge-subtle px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-text-1">{level.label}</span>
                    {typeof level.marks === "number" ? (
                      <span className="text-[11px] text-ai">{level.marks}</span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs text-text-3">{level.descriptor}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
        {typeof rubric.totalMarks === "number" ? (
          <p className="text-xs text-text-3">Total marks: {rubric.totalMarks}</p>
        ) : null}
      </div>
    );
  }

  if (kind === "lesson-outline") {
    const outline = content as LessonOutline;
    return (
      <div className="space-y-3">
        {outline.title ? <h4 className="font-display text-base text-text-1">{outline.title}</h4> : null}
        {outline.objectives?.length ? (
          <div>
            <p className={eyebrow}>Objectives</p>
            <ul className="mt-1 space-y-1 text-sm text-text-2">
              {outline.objectives.map((objective, index) => (
                <li key={index} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ai/70" />
                  {objective}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <ol className="space-y-2">
          {(outline.sections ?? []).map((section, index) => (
            <li key={index} className={card}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-text-1">{section.heading}</p>
                {typeof section.minutes === "number" ? (
                  <span className="text-xs text-text-3">{section.minutes} min</span>
                ) : null}
              </div>
              {section.summary ? <p className="mt-1 text-sm text-text-2">{section.summary}</p> : null}
            </li>
          ))}
        </ol>
        {outline.assessmentIdea ? (
          <div className=" border border-ai/25 bg-ai-bg px-3 py-2 text-sm text-ai">
            Assessment idea: {outline.assessmentIdea}
          </div>
        ) : null}
      </div>
    );
  }

  if (kind === "course-outline") {
    const outline = content as CourseOutline;
    return (
      <div className="space-y-3">
        {outline.title ? <h4 className="font-display text-base text-text-1">{outline.title}</h4> : null}
        {outline.summary ? <p className="text-sm text-text-2">{outline.summary}</p> : null}
        {outline.learningOutcomes?.length ? (
          <div>
            <p className={eyebrow}>Learning outcomes</p>
            <ul className="mt-1 space-y-1 text-sm text-text-2">
              {outline.learningOutcomes.map((outcome, index) => (
                <li key={index} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ai/70" />
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {(outline.modules ?? []).map((module, index) => (
          <div key={index} className={card}>
            <p className="text-sm font-medium text-text-1">
              Module {index + 1}: {module.title}
            </p>
            {module.summary ? <p className="mt-1 text-xs text-text-2">{module.summary}</p> : null}
            <ul className="mt-2 space-y-1 text-sm text-text-2">
              {(module.lessons ?? []).map((lesson, lessonIndex) => (
                <li key={lessonIndex} className="flex flex-wrap items-center gap-2">
                  <span>{lesson.title}</span>
                  {lesson.lessonType ? (
                    <span className="eyebrow text-text-3">{lesson.lessonType}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return <pre className="overflow-auto text-xs text-text-2">{JSON.stringify(content, null, 2)}</pre>;
}

export function ContentStudio({
  courseId,
  lessons,
  report,
}: {
  courseId: ID;
  lessons: Array<{ id: ID; label: string }>;
  report: { helpful: number; notHelpful: number; faqCount: number; usageCount: number; draftCount: number };
}) {
  const [kind, setKind] = useState<Kind>("lesson-outline");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showJson, setShowJson] = useState(false);
  const [edited, setEdited] = useState("");
  const toast = useToast();

  const selected = candidates.find((item) => item.selected) || candidates.at(-1);
  const selectedText = useMemo(
    () =>
      selected
        ? typeof selected.content === "string"
          ? selected.content
          : JSON.stringify(selected.content, null, 2)
        : "",
    [selected],
  );

  async function apiRequest(body: unknown) {
    const response = await fetch("/api/staff/ai/content-studio", {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Content Studio request failed.");
    return result;
  }

  function readControls(form: HTMLFormElement) {
    const data = new FormData(form);
    return {
      audience: data.get("audience"),
      level: data.get("level"),
      context: data.get("context"),
      tone: data.get("tone"),
      length: data.get("length"),
      difficulty: data.get("difficulty"),
      exampleCount: Number(data.get("exampleCount")),
      outcome: data.get("outcome"),
      assessmentType: data.get("assessmentType"),
      marks: Number(data.get("marks")),
      count: Number(data.get("count")),
    };
  }

  async function generate(form: HTMLFormElement) {
    setBusy(true);
    setError("");
    const data = new FormData(form);
    try {
      const result = await apiRequest({
        action: "generate",
        courseId,
        lessonId: data.get("lessonId") || undefined,
        kind,
        instruction: data.get("instruction"),
        controls: readControls(form),
      });
      setCandidates((current) => [
        ...current.slice(-2).map((item) => ({ ...item, selected: false })),
        { id: crypto.randomUUID(), content: result.candidate, provenance: result.provenance, selected: true },
      ]);
      setEdited("");
      setShowJson(false);
      if (result.notice) toast.push(result.notice, "info");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Generation failed.");
    } finally {
      setBusy(false);
    }
  }

  async function save(form: HTMLFormElement) {
    if (!selected) return;
    const data = new FormData(form);
    let content: unknown = edited || selectedText;
    if (isStructuredKind(kind)) {
      try {
        content = JSON.parse(String(content));
      } catch {
        toast.push("Structured drafts must remain valid JSON before saving.", "error");
        return;
      }
    }
    setBusy(true);
    try {
      const result = await apiRequest({
        action: "save",
        courseId,
        lessonId: data.get("lessonId") || undefined,
        kind,
        title: data.get("title") || `${kind} draft`,
        content,
        controls: readControls(form),
        provenance: selected.provenance,
      });
      toast.push(`Draft ${result.draftId} saved. Not published.`, "success");
    } catch (caught) {
      toast.push(caught instanceof Error ? caught.message : "Save failed.", "error");
    } finally {
      setBusy(false);
    }
  }

  async function insertAssessment(form: HTMLFormElement) {
    if (!selected || (kind !== "quiz" && kind !== "rubric")) return;
    const data = new FormData(form);
    let content: unknown = edited || selected.content;
    if (typeof content === "string") {
      try {
        content = JSON.parse(content);
      } catch {
        toast.push("Structured drafts must remain valid JSON before inserting.", "error");
        return;
      }
    }
    setBusy(true);
    try {
      const payload = assessmentCreateDataFromStudio({
        courseId,
        kind,
        content,
        lessonId: data.get("lessonId") ? String(data.get("lessonId")) : undefined,
      });
      const response = await fetch("/api/staff/records", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ collection: "lms-assessments", action: "create", data: payload }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to insert assessment.");
      toast.push("Inserted as a draft assessment. Review it in Assessments before publishing.", "success");
    } catch (caught) {
      toast.push(caught instanceof Error ? caught.message : "Insert failed.", "error");
    } finally {
      setBusy(false);
    }
  }

  async function copyCandidate(content: unknown) {
    const text = typeof content === "string" ? content : JSON.stringify(content, null, 2);
    try {
      await navigator.clipboard.writeText(text);
      toast.push("Copied to clipboard.", "success");
    } catch {
      toast.push("Couldn’t copy — use the JSON view to select manually.", "error");
    }
  }

  const metrics = [
    { value: report.usageCount, label: "Tutor requests" },
    { value: report.helpful, label: "Helpful ratings" },
    { value: report.notHelpful, label: "Needs review" },
    { value: report.faqCount, label: "Approved FAQs" },
    { value: report.draftCount, label: "Saved drafts" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-[var(--radius-md)] border border-edge-subtle bg-inset px-3 py-3 text-center">
            <strong className="block text-xl text-accent">{metric.value}</strong>
            <span className="text-[11px] text-text-3">{metric.label}</span>
          </div>
        ))}
      </div>

      <p className="flex items-center gap-2 border border-ai/25 bg-ai-bg px-3 py-2 text-xs text-ai">
        <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
        AI-generated drafts — review before publishing. Saving stores a versioned draft and never publishes it.
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void generate(event.currentTarget);
        }}
        className="space-y-5"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className={card}>
            <p className={eyebrow}>Draft brief</p>
            <div className="mt-3 space-y-3">
              <label className={labelCls}>
                Draft type
                <Select
                  className={field}
                  value={kind}
                  onChange={(event) => setKind(event.target.value as Kind)}
                >
                  {kinds.map((item) => (
                    <option key={item} value={item}>
                      {kindLabel[item]}
                    </option>
                  ))}
                </Select>
              </label>
              <label className={labelCls}>
                Lesson
                <Select className={field} name="lessonId" defaultValue="">
                  <option value="">Whole course</option>
                  {lessons.map((item) => (
                    <option value={String(item.id)} key={item.id}>
                      {item.label}
                    </option>
                  ))}
                </Select>
              </label>
              <label className={labelCls}>
                Title
                <input className={field} name="title" defaultValue="AI-assisted draft" maxLength={200} />
              </label>
              <label className={labelCls}>
                Instruction
                <textarea
                  className={`${field} min-h-24`}
                  name="instruction"
                  required
                  minLength={3}
                  maxLength={12000}
                  placeholder="Describe the draft you need…"
                />
              </label>
              <label className={labelCls}>
                Additional context
                <textarea className={`${field} min-h-16`} name="context" maxLength={5000} />
              </label>
              <label className={labelCls}>
                Outcome
                <input className={field} name="outcome" maxLength={1000} />
              </label>
            </div>
          </div>

          <div className={card}>
            <p className={eyebrow}>Controls</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className={labelCls}>
                Audience
                <input className={field} name="audience" defaultValue="SMN learners" maxLength={200} />
              </label>
              <label className={labelCls}>
                Level
                <Select className={field} name="level" defaultValue="foundation">
                  <option value="foundation">Foundation</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </Select>
              </label>
              <label className={labelCls}>
                Tone
                <Select className={field} name="tone" defaultValue="clear">
                  <option value="clear">Clear</option>
                  <option value="encouraging">Encouraging</option>
                  <option value="professional">Professional</option>
                  <option value="conversational">Conversational</option>
                </Select>
              </label>
              <label className={labelCls}>
                Length
                <Select className={field} name="length" defaultValue="medium">
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </Select>
              </label>
            </div>

            <details className="mt-3 rounded-[var(--radius-md)] border border-edge-subtle px-3 py-2">
              <summary className="cursor-pointer text-xs text-text-2 select-none">
                Advanced assessment controls
              </summary>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <label className={labelCls}>
                  Difficulty
                  <Select className={field} name="difficulty" defaultValue="balanced">
                    <option value="easy">Easy</option>
                    <option value="balanced">Balanced</option>
                    <option value="challenging">Challenging</option>
                  </Select>
                </label>
                <label className={labelCls}>
                  Examples
                  <input className={field} name="exampleCount" type="number" min={0} max={10} defaultValue={2} />
                </label>
                <label className={labelCls}>
                  Assessment type
                  <input className={field} name="assessmentType" maxLength={100} />
                </label>
                <label className={labelCls}>
                  Marks
                  <input className={field} name="marks" type="number" min={1} max={1000} defaultValue={10} />
                </label>
                <label className={labelCls}>
                  Count
                  <input className={field} name="count" type="number" min={1} max={30} defaultValue={5} />
                </label>
              </div>
            </details>

            <button
              className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-accent-strong px-5 py-2 text-sm font-medium text-text-1 transition hover:bg-[#0c3ab0] active:scale-[0.97] disabled:opacity-50"
              disabled={busy}
              type="submit"
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              {busy ? "Generating…" : candidates.length ? "Regenerate candidate" : "Generate candidate"}
            </button>
            {error ? (
              <p className="mt-3 text-sm text-danger" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        </div>

        {candidates.length ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-lg text-text-1">Compare candidates</h3>
              <StatusBadge label="Draft · not published" tone="warning" />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {candidates.map((candidate) => {
                const isSelected = (selected?.id ?? "") === candidate.id;
                return (
                  <article
                    key={candidate.id}
                    className={cn(
                      "flex flex-col border bg-raised p-4 transition",
                      isSelected ? "border-ai/50 ring-1 ring-ai/30" : "border-edge-subtle",
                    )}
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase tracking-wider text-ai">{kindLabel[kind]}</span>
                      {isSelected ? <StatusBadge label="Selected" tone="success" /> : null}
                    </div>
                    <div className="min-h-0 flex-1 overflow-auto">
                      <CandidatePreview kind={kind} content={candidate.content} />
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-edge-subtle pt-3 text-xs">
                      <button
                        type="button"
                        className="rounded-full border border-edge px-3 py-1 text-text-2 transition hover:border-ai/40 hover:text-text-1 active:scale-[0.97]"
                        onClick={() =>
                          setCandidates((current) =>
                            current.map((item) => ({ ...item, selected: item.id === candidate.id })),
                          )
                        }
                      >
                        Select
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-text-3 transition hover:text-text-1"
                        onClick={() => void copyCandidate(candidate.content)}
                      >
                        <Copy className="h-3.5 w-3.5" aria-hidden />
                        Copy
                      </button>
                      <button
                        type="button"
                        className="text-text-3 transition hover:text-danger"
                        onClick={() => setCandidates((current) => current.filter((item) => item.id !== candidate.id))}
                      >
                        Reject
                      </button>
                      <span className="ml-auto text-[10px] text-text-3">
                        {candidate.provenance.provider} · {candidate.provenance.model}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            {selected ? (
              <div className={card}>
                <div className="flex items-center justify-between gap-3">
                  <p className={eyebrow}>Selected draft</p>
                  <button
                    type="button"
                    onClick={() => setShowJson((value) => !value)}
                    className="inline-flex items-center gap-1.5 text-xs text-text-2 transition hover:text-text-1"
                  >
                    <FileJson className="h-3.5 w-3.5" aria-hidden />
                    {showJson ? "Hide raw" : "Edit raw"}
                  </button>
                </div>
                {showJson ? (
                  <textarea
                    className={`${field} mt-3 min-h-56 font-mono text-xs`}
                    value={edited || selectedText}
                    onChange={(event) => setEdited(event.target.value)}
                  />
                ) : (
                  <div className="mt-3">
                    <CandidatePreview kind={kind} content={edited && isStructuredKind(kind) ? safeParse(edited) : selected.content} />
                  </div>
                )}
                <button
                  className="mt-4 inline-flex min-h-10 items-center justify-center rounded-full bg-ai px-5 py-2 text-sm font-semibold text-[#07110c] transition hover:bg-[#63c3a4] active:scale-[0.97] disabled:opacity-50"
                  disabled={busy}
                  onClick={(event) => {
                    event.preventDefault();
                    const form = event.currentTarget.form;
                    if (form) void save(form);
                  }}
                  type="button"
                >
                  {busy ? "Saving…" : "Save reviewed draft"}
                </button>
                {kind === "quiz" || kind === "rubric" ? (
                  <button
                    className="mt-3 ml-3 inline-flex min-h-10 items-center justify-center rounded-full border border-accent/40 px-5 py-2 text-sm text-accent transition hover:bg-accent-bg disabled:opacity-50"
                    disabled={busy}
                    onClick={(event) => {
                      event.preventDefault();
                      const form = event.currentTarget.form;
                      if (form) void insertAssessment(form);
                    }}
                    type="button"
                  >
                    Insert as assessment
                  </button>
                ) : null}
              </div>
            ) : null}
          </section>
        ) : null}
      </form>

      <p className="text-xs leading-relaxed text-text-3">
        Generated material is a versioned draft. Saving never publishes it — use the ordinary Course Builder readiness
        and publication flow after human review.
      </p>
    </div>
  );
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
