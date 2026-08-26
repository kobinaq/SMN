"use client";
/* eslint-disable @next/next/no-img-element */

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ExternalLink, Pencil, Plus, Trash2 } from "@/components/ui/icons";
import type { PortfolioItem } from "@/lib/portfolios";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/Feedback";
import { Card } from "@/components/ui/Surface";
import { Chip } from "@/components/ui/Chip";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { TagInput } from "@/components/ui/TagInput";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

const steps = [
  "Title & summary",
  "Problem",
  "Your role & process",
  "Outcome & evidence",
  "Publish settings",
] as const;

type Draft = PortfolioItem | null;

export function PortfolioManager({
  initial,
  publicPreviewHref,
}: {
  initial: PortfolioItem[];
  publicPreviewHref?: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<Draft>(null);
  const [creating, setCreating] = useState(false);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteId, setDeleteId] = useState<string | number | null>(null);

  const formOpen = creating || Boolean(editing);
  const defaults = useMemo(
    () =>
      editing || {
        id: "",
        title: "",
        slug: "",
        summary: "",
        challenge: "",
        approach: "",
        outcome: "",
        skills: [],
        projectUrl: "",
        coverUrl: "",
        status: "draft",
        visibility: "private",
      },
    [editing],
  );

  function closeForm() {
    setCreating(false);
    setEditing(null);
    setStep(0);
    setMessage("");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const form = event.currentTarget;
    const method = editing ? "PATCH" : "POST";
    try {
      const response = await fetch("/api/portfolios", {
        method,
        credentials: "include",
        body: new FormData(form),
      });
      const json = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setMessage(json.error || "Unable to save.");
        toast.push(json.error || "Unable to save.", "error");
        return;
      }
      toast.push(editing ? "Case study updated." : "Case study saved.", "success");
      closeForm();
      router.refresh();
    } catch {
      setMessage("Unable to save the case study.");
      toast.push("Unable to save the case study.", "error");
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (deleteId == null) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/portfolios?id=${deleteId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Unable to delete.");
      setItems((current) => current.filter((item) => item.id !== deleteId));
      toast.push("Case study deleted.", "success");
      setDeleteId(null);
      router.refresh();
    } catch {
      toast.push("Unable to delete the case study.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap justify-end gap-2">
        {publicPreviewHref ? (
          <Button href={publicPreviewHref} variant="secondary">
            Public preview
          </Button>
        ) : null}
        <Button
          type="button"
          onClick={() => {
            setEditing(null);
            setCreating(true);
            setStep(0);
          }}
        >
          <Plus className="h-4 w-4" />
          {formOpen && creating ? "New case study" : "Add case study"}
        </Button>
      </div>

      {formOpen ? (
        <Card as="section" className="rise">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow text-accent">Guided case study</p>
              <h2 className="mt-1 font-display text-xl text-text-1">{editing ? "Edit case study" : "New case study"}</h2>
            </div>
            <button type="button" onClick={closeForm} className="text-sm text-text-3 transition-colors hover:text-text-1">
              Cancel
            </button>
          </div>

          <ol className="mt-5 flex flex-wrap gap-2" aria-label="Case study steps">
            {steps.map((label, index) => (
              <li key={label}>
                <button type="button" onClick={() => setStep(index)}>
                  <Chip tone={step === index ? "accent" : "neutral"}>
                    {index + 1}. {label}
                  </Chip>
                </button>
              </li>
            ))}
          </ol>

          <form id="portfolio-form" onSubmit={submit} className="mt-5 space-y-4">
            {editing ? <input type="hidden" name="id" value={String(editing.id)} /> : null}

            <div className={cn("space-y-4", step !== 0 && "hidden")}>
              <Field label="Project title" htmlFor="pf-title" required>
                <Input id="pf-title" name="title" required minLength={3} defaultValue={defaults.title} />
              </Field>
              <Field label="Project summary" htmlFor="pf-summary" required>
                <Textarea
                  id="pf-summary"
                  name="summary"
                  required
                  minLength={20}
                  defaultValue={defaults.summary}
                  placeholder="One short paragraph describing the project"
                />
              </Field>
            </div>

            <div className={cn("space-y-4", step !== 1 && "hidden")}>
              <Field label="Problem or brief" htmlFor="pf-challenge" required>
                <Textarea
                  id="pf-challenge"
                  name="challenge"
                  required
                  minLength={20}
                  defaultValue={defaults.challenge}
                  className="min-h-32"
                  placeholder="What problem, brief, or constraint were you solving?"
                />
              </Field>
            </div>

            <div className={cn("space-y-4", step !== 2 && "hidden")}>
              <Field label="Your role and process" htmlFor="pf-approach" required>
                <Textarea
                  id="pf-approach"
                  name="approach"
                  required
                  minLength={20}
                  defaultValue={defaults.approach}
                  className="min-h-32"
                  placeholder="Start with your role, then the decisions and process you used."
                />
              </Field>
              <TagInput name="skills" label="Tools or skills used" initial={defaults.skills} placeholder="Add a skill or tool" hint="Press Enter to add tags." />
            </div>

            <div className={cn("space-y-4", step !== 3 && "hidden")}>
              <Field label="Outcome and reflection" htmlFor="pf-outcome" required>
                <Textarea
                  id="pf-outcome"
                  name="outcome"
                  required
                  minLength={20}
                  defaultValue={defaults.outcome}
                  className="min-h-32"
                  placeholder="What changed, what you learned, and what you would do next."
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Evidence / project URL" htmlFor="pf-url">
                  <Input id="pf-url" name="projectUrl" type="url" defaultValue={defaults.projectUrl} placeholder="https://" />
                </Field>
                <Field label="Cover image URL" htmlFor="pf-cover-url">
                  <Input id="pf-cover-url" name="coverUrl" type="url" defaultValue={defaults.coverUrl} placeholder="Optional external image URL" />
                </Field>
              </div>
              <Field label="Upload cover image" htmlFor="pf-cover" hint="Optional image up to 10 MB.">
                <input
                  id="pf-cover"
                  name="cover"
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-text-2 file:mr-3 file:rounded-full file:border-0 file:bg-inset file:px-3 file:py-1.5 file:text-xs file:text-text-1"
                />
              </Field>
            </div>

            <div className={cn("space-y-4", step !== 4 && "hidden")}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Status" htmlFor="pf-status">
                  <Select id="pf-status" name="status" defaultValue={defaults.status}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </Select>
                </Field>
                <Field label="Visibility" htmlFor="pf-visibility">
                  <Select id="pf-visibility" name="visibility" defaultValue={defaults.visibility}>
                    <option value="private">Private</option>
                    <option value="members">Members only</option>
                    <option value="public">Public</option>
                  </Select>
                </Field>
              </div>
              <p className="rounded-[var(--radius-md)] border border-edge-subtle bg-inset px-4 py-3 text-xs text-text-3">
                Published + public items appear on your public profile preview. Keep drafts private while you refine
                the story.
                {publicPreviewHref ? (
                  <>
                    {" "}
                    <a href={publicPreviewHref} className="text-accent hover:underline">
                      Open public preview
                    </a>
                    .
                  </>
                ) : null}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {step > 0 ? (
                <Button type="button" variant="secondary" onClick={() => setStep((value) => value - 1)}>
                  Back
                </Button>
              ) : null}
              {step < steps.length - 1 ? (
                <Button type="button" onClick={() => setStep((value) => value + 1)}>
                  Continue
                </Button>
              ) : (
                <Button type="submit" disabled={busy} aria-busy={busy}>
                  {busy ? "Saving…" : editing ? "Update case study" : "Save case study"}
                </Button>
              )}
            </div>
            {message ? (
              <p className="text-sm text-danger" role="alert">
                {message}
              </p>
            ) : null}
          </form>
        </Card>
      ) : null}

      {items.length ? (
        <div className="rise-stagger grid gap-4 md:grid-cols-2">
          {items.map((item, index) => (
            <Card key={item.id} padded={false} style={{ "--i": index } as React.CSSProperties} className="overflow-hidden">
              {item.coverUrl ? <img src={item.coverUrl} alt="" className="h-44 w-full object-cover" /> : null}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl text-text-1">{item.title}</h2>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Chip tone={item.status === "published" ? "ai" : "neutral"}>{item.status}</Chip>
                      <Chip tone="accent">{item.visibility}</Chip>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCreating(false);
                        setEditing(item);
                        setStep(0);
                      }}
                      className="text-text-3 transition-colors hover:text-accent"
                      aria-label={`Edit ${item.title}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(item.id)}
                      className="text-text-3 transition-colors hover:text-danger"
                      aria-label={`Delete ${item.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-3 line-clamp-3 text-sm text-text-2">{item.summary}</p>
                {item.projectUrl ? (
                  <a href={item.projectUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm text-accent">
                    View evidence
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No case studies yet"
          description="Add your first case study to show how you think and what you delivered."
          action={
            <Button
              type="button"
              onClick={() => {
                setCreating(true);
                setStep(0);
              }}
            >
              Add case study
            </Button>
          }
        />
      )}

      <ConfirmDialog
        open={deleteId != null}
        title="Delete this case study?"
        description="This cannot be undone."
        confirmLabel="Delete"
        destructive
        busy={busy}
        onClose={() => !busy && setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
