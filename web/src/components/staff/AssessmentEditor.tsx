"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { staffFieldClass, StaffFormField } from "@/components/staff/ui";
import { Select } from "@/components/ui/Select";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

type Question = {
  id?: string;
  prompt: string;
  type: "multiple-choice" | "short-answer";
  optionsText: string;
  answer: string;
  marks: string;
};

type RubricRow = {
  criterion: string;
  description: string;
  levelsText: string;
};

type Initial = {
  title?: string;
  slug?: string;
  kind?: string;
  instructions?: string;
  availableFrom?: string;
  dueAt?: string;
  allowLate?: boolean;
  maxAttempts?: string | number;
  totalMarks?: string | number;
  status?: string;
  questions?: Array<{
    id?: string;
    prompt?: string | null;
    type?: string | null;
    options?: Array<{ option?: string | null }> | null;
    answer?: string | null;
    marks?: number | null;
  }>;
  rubric?: Array<{
    criterion?: string | null;
    description?: string | null;
    levels?: Array<{ label?: string | null; descriptor?: string | null; marks?: number | null }> | null;
  }>;
};

function emptyQuestion(): Question {
  return { prompt: "", type: "multiple-choice", optionsText: "", answer: "", marks: "1" };
}

export function AssessmentEditor({
  courseId,
  assessmentId,
  moduleOptions,
  lessonOptions,
  initial,
  moduleId,
  lessonId,
}: {
  courseId: string | number;
  assessmentId?: string | number;
  moduleOptions: Array<{ id: string | number; title: string }>;
  lessonOptions: Array<{ id: string | number; title: string }>;
  initial?: Initial;
  moduleId?: string;
  lessonId?: string;
}) {
  const router = useRouter();
  const [kind, setKind] = useState<"assignment" | "quiz">(initial?.kind === "quiz" ? "quiz" : "assignment");
  const [questions, setQuestions] = useState<Question[]>(
    initial?.questions?.length
      ? initial.questions.map((item) => ({
          id: item.id,
          prompt: item.prompt || "",
          type: item.type === "short-answer" ? "short-answer" : "multiple-choice",
          optionsText: (item.options || []).map((row) => row.option || "").filter(Boolean).join("\n"),
          answer: item.answer || "",
          marks: String(item.marks ?? 1),
        }))
      : [emptyQuestion()],
  );
  const [rubric, setRubric] = useState<RubricRow[]>(
    initial?.rubric?.length
      ? initial.rubric.map((item) => ({
          criterion: item.criterion || "",
          description: item.description || "",
          levelsText: (item.levels || [])
            .map((level) => `${level.label || "Level"}|${level.marks ?? 0}|${level.descriptor || ""}`)
            .join("\n"),
        }))
      : [{ criterion: "", description: "", levelsText: "Developing|1|\nSecure|3|\nStrong|5|" }],
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    const parsedQuestions = questions
      .filter((item) => item.prompt.trim())
      .map((item) => ({
        id: item.id,
        prompt: item.prompt.trim(),
        type: item.type,
        options: item.optionsText
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((option) => ({ option })),
        answer: item.answer.trim(),
        marks: Number(item.marks) || 1,
      }));
    const parsedRubric = rubric
      .filter((item) => item.criterion.trim())
      .map((item) => ({
        criterion: item.criterion.trim(),
        description: item.description.trim(),
        levels: item.levelsText
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const [label, marks, ...rest] = line.split("|");
            return {
              label: (label || "Level").trim(),
              marks: Number(marks) || 0,
              descriptor: rest.join("|").trim(),
            };
          }),
      }));

    try {
      const response = await fetch("/api/staff/records", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          collection: "lms-assessments",
          action: assessmentId ? "update" : "create",
          id: assessmentId,
          data: {
            course: courseId,
            module: String(form.get("module") || "") || null,
            lesson: String(form.get("lesson") || "") || null,
            title,
            slug: String(form.get("slug") || "").trim() || slugify(title),
            kind,
            instructions: String(form.get("instructions") || "").trim(),
            availableFrom: String(form.get("availableFrom") || "") || null,
            dueAt: String(form.get("dueAt") || "") || null,
            allowLate: form.get("allowLate") === "on",
            maxAttempts: String(form.get("maxAttempts") || "") || null,
            totalMarks:
              kind === "quiz"
                ? parsedQuestions.reduce((total, item) => total + item.marks, 0)
                : parsedRubric.reduce(
                    (total, item) =>
                      total + item.levels.reduce((max, level) => Math.max(max, level.marks), 0),
                    0,
                  ),
            questions: kind === "quiz" ? parsedQuestions : [],
            rubric: parsedRubric,
            status: String(form.get("status") || "draft"),
          },
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to save assessment.");
      router.push(`/staff/learning/assessments/${result.id || assessmentId}`);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save assessment.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <StaffFormField label="Title">
        <input className={staffFieldClass} name="title" required defaultValue={initial?.title || ""} maxLength={200} />
      </StaffFormField>
      <StaffFormField label="Slug">
        <input className={staffFieldClass} name="slug" defaultValue={initial?.slug || ""} maxLength={80} />
      </StaffFormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <StaffFormField label="Type">
          <Select
            className={staffFieldClass}
            value={kind}
            onChange={(event) => setKind(event.target.value === "quiz" ? "quiz" : "assignment")}
          >
            <option value="assignment">Assignment</option>
            <option value="quiz">Quiz</option>
          </Select>
        </StaffFormField>
        <StaffFormField label="Status">
          <Select className={staffFieldClass} name="status" defaultValue={initial?.status || "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </Select>
        </StaffFormField>
      </div>
      <StaffFormField label="Instructions">
        <textarea
          className={staffFieldClass}
          name="instructions"
          required
          rows={5}
          defaultValue={initial?.instructions || ""}
        />
      </StaffFormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <StaffFormField label="Available from">
          <input className={staffFieldClass} name="availableFrom" type="datetime-local" defaultValue={initial?.availableFrom || ""} />
        </StaffFormField>
        <StaffFormField label="Due">
          <input className={staffFieldClass} name="dueAt" type="datetime-local" defaultValue={initial?.dueAt || ""} />
        </StaffFormField>
        <StaffFormField label="Max attempts">
          <input className={staffFieldClass} name="maxAttempts" type="number" min={1} defaultValue={initial?.maxAttempts ?? 1} />
        </StaffFormField>
        <label className="flex items-start gap-3 self-end text-sm text-text-2">
          <input className="mt-1 h-4 w-4 accent-accent" type="checkbox" name="allowLate" defaultChecked={Boolean(initial?.allowLate)} />
          Allow late submissions
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <StaffFormField label="Module (optional)">
          <Select className={staffFieldClass} name="module" defaultValue={moduleId || ""}>
            <option value="">None</option>
            {moduleOptions.map((item) => (
              <option key={String(item.id)} value={String(item.id)}>
                {item.title}
              </option>
            ))}
          </Select>
        </StaffFormField>
        <StaffFormField label="Lesson (optional)">
          <Select className={staffFieldClass} name="lesson" defaultValue={lessonId || ""}>
            <option value="">None</option>
            {lessonOptions.map((item) => (
              <option key={String(item.id)} value={String(item.id)}>
                {item.title}
              </option>
            ))}
          </Select>
        </StaffFormField>
      </div>

      {kind === "quiz" ? (
        <div className="space-y-3">
          <p className="text-sm text-text-2">Multiple-choice answers are hidden from learners and scored on submit.</p>
          {questions.map((question, index) => (
            <article key={question.id || index} className="rounded-[var(--radius-lg)] border border-edge-subtle p-4">
              <StaffFormField label={`Question ${index + 1}`}>
                <textarea
                  className={staffFieldClass}
                  value={question.prompt}
                  onChange={(event) =>
                    setQuestions((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, prompt: event.target.value } : item,
                      ),
                    )
                  }
                  rows={3}
                />
              </StaffFormField>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <StaffFormField label="Type">
                  <Select
                    className={staffFieldClass}
                    value={question.type}
                    onChange={(event) =>
                      setQuestions((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, type: event.target.value === "short-answer" ? "short-answer" : "multiple-choice" }
                            : item,
                        ),
                      )
                    }
                  >
                    <option value="multiple-choice">Multiple choice</option>
                    <option value="short-answer">Short answer</option>
                  </Select>
                </StaffFormField>
                <StaffFormField label="Marks">
                  <input
                    className={staffFieldClass}
                    type="number"
                    min={1}
                    value={question.marks}
                    onChange={(event) =>
                      setQuestions((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, marks: event.target.value } : item,
                        ),
                      )
                    }
                  />
                </StaffFormField>
              </div>
              {question.type === "multiple-choice" ? (
                <StaffFormField label="Options (one per line)">
                  <textarea
                    className={staffFieldClass}
                    rows={4}
                    value={question.optionsText}
                    onChange={(event) =>
                      setQuestions((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, optionsText: event.target.value } : item,
                        ),
                      )
                    }
                  />
                </StaffFormField>
              ) : null}
              <StaffFormField label={question.type === "multiple-choice" ? "Correct option (hidden from learners)" : "Reference answer (staff only)"}>
                <input
                  className={staffFieldClass}
                  value={question.answer}
                  onChange={(event) =>
                    setQuestions((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, answer: event.target.value } : item,
                      ),
                    )
                  }
                />
              </StaffFormField>
            </article>
          ))}
          <button
            type="button"
            className="text-sm text-accent hover:underline"
            onClick={() => setQuestions((current) => [...current, emptyQuestion()])}
          >
            Add question
          </button>
        </div>
      ) : null}

      <div className="space-y-3">
        <p className="text-sm text-text-2">
          Rubric for assignments and short answers. One level per line as label|marks|descriptor.
        </p>
        {rubric.map((row, index) => (
          <article key={index} className="rounded-[var(--radius-lg)] border border-edge-subtle p-4">
            <StaffFormField label="Criterion">
              <input
                className={staffFieldClass}
                value={row.criterion}
                onChange={(event) =>
                  setRubric((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, criterion: event.target.value } : item,
                    ),
                  )
                }
              />
            </StaffFormField>
            <StaffFormField label="Description">
              <textarea
                className={staffFieldClass}
                rows={2}
                value={row.description}
                onChange={(event) =>
                  setRubric((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, description: event.target.value } : item,
                    ),
                  )
                }
              />
            </StaffFormField>
            <StaffFormField label="Levels">
              <textarea
                className={staffFieldClass}
                rows={4}
                value={row.levelsText}
                onChange={(event) =>
                  setRubric((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, levelsText: event.target.value } : item,
                    ),
                  )
                }
              />
            </StaffFormField>
          </article>
        ))}
        <button
          type="button"
          className="text-sm text-accent hover:underline"
          onClick={() =>
            setRubric((current) => [...current, { criterion: "", description: "", levelsText: "Developing|1|\nSecure|3|" }])
          }
        >
          Add criterion
        </button>
      </div>

      {error ? (
        <p className="rounded-2xl border border-danger/30 bg-danger-bg px-4 py-3 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="rounded-full border border-accent/40 bg-accent-bg px-5 py-2.5 text-sm text-accent transition hover:bg-accent/20 disabled:opacity-50"
      >
        {busy ? "Saving…" : assessmentId ? "Save assessment" : "Create assessment"}
      </button>
    </form>
  );
}
