"use client";
/* eslint-disable @next/next/no-img-element */

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import type { PortfolioItem } from "@/lib/portfolios";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState, StatusBadge } from "@/components/ui/Feedback";
import { TagInput } from "@/components/ui/TagInput";
import { useToast } from "@/components/ui/Toast";

const field =
  "field w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/35";

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
        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-white/10 bg-surface p-5 sm:p-7">
          {editing ? <input type="hidden" name="id" value={String(editing.id)} /> : null}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-baby-blue">
                Guided case study
              </p>
              <h2 className="mt-1 font-display text-xl text-white">
                {editing ? "Edit case study" : "New case study"}
              </h2>
            </div>
            <button type="button" onClick={closeForm} className="text-sm text-white/45 hover:text-white">
              Cancel
            </button>
          </div>

          <ol className="flex flex-wrap gap-2" aria-label="Case study steps">
            {steps.map((label, index) => (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => setStep(index)}
                  className={`rounded-full border px-3 py-1.5 text-xs ${
                    step === index
                      ? "border-baby-blue/40 bg-baby-blue/15 text-baby-blue"
                      : "border-white/10 text-white/45"
                  }`}
                >
                  {index + 1}. {label}
                </button>
              </li>
            ))}
          </ol>

          <div className={step === 0 ? "space-y-3" : "hidden"}>
            <label className="block text-sm text-white/70">
              Project title
              <input className={`${field} mt-2`} name="title" required minLength={3} defaultValue={defaults.title} />
            </label>
            <label className="block text-sm text-white/70">
              Project summary
              <textarea
                className={`${field} mt-2 min-h-24`}
                name="summary"
                required
                minLength={20}
                defaultValue={defaults.summary}
                placeholder="One short paragraph describing the project"
              />
            </label>
          </div>

          <div className={step === 1 ? "space-y-3" : "hidden"}>
            <label className="block text-sm text-white/70">
              Problem or brief
              <textarea
                className={`${field} mt-2 min-h-32`}
                name="challenge"
                required
                minLength={20}
                defaultValue={defaults.challenge}
                placeholder="What problem, brief, or constraint were you solving?"
              />
            </label>
          </div>

          <div className={step === 2 ? "space-y-3" : "hidden"}>
            <label className="block text-sm text-white/70">
              Your role and process
              <textarea
                className={`${field} mt-2 min-h-32`}
                name="approach"
                required
                minLength={20}
                defaultValue={defaults.approach}
                placeholder="Start with your role, then the decisions and process you used."
              />
            </label>
            <TagInput
              name="skills"
              label="Tools or skills used"
              initial={defaults.skills}
              placeholder="Add a skill or tool"
              hint="Press Enter to add tags."
            />
          </div>

          <div className={step === 3 ? "space-y-3" : "hidden"}>
            <label className="block text-sm text-white/70">
              Outcome and reflection
              <textarea
                className={`${field} mt-2 min-h-32`}
                name="outcome"
                required
                minLength={20}
                defaultValue={defaults.outcome}
                placeholder="What changed, what you learned, and what you would do next."
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm text-white/70">
                Evidence / project URL
                <input
                  className={`${field} mt-2`}
                  name="projectUrl"
                  type="url"
                  defaultValue={defaults.projectUrl}
                  placeholder="https://"
                />
              </label>
              <label className="block text-sm text-white/70">
                Cover image URL
                <input
                  className={`${field} mt-2`}
                  name="coverUrl"
                  type="url"
                  defaultValue={defaults.coverUrl}
                  placeholder="Optional external image URL"
                />
              </label>
            </div>
            <label className="block text-sm text-white/70">
              Upload cover image
              <input className={`${field} mt-2`} name="cover" type="file" accept="image/*" />
              <span className="mt-1 block text-xs text-white/40">Optional image up to 10 MB.</span>
            </label>
          </div>

          <div className={step === 4 ? "space-y-3" : "hidden"}>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm text-white/70">
                Status
                <select className={`${field} mt-2 bg-surface`} name="status" defaultValue={defaults.status}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
              <label className="block text-sm text-white/70">
                Visibility
                <select className={`${field} mt-2 bg-surface`} name="visibility" defaultValue={defaults.visibility}>
                  <option value="private">Private</option>
                  <option value="members">Members only</option>
                  <option value="public">Public</option>
                </select>
              </label>
            </div>
            <p className="rounded-2xl border border-white/10 bg-near-black/40 px-4 py-3 text-xs text-white/45">
              Published + public items appear on your public profile preview. Keep drafts private while you refine the
              story.
              {publicPreviewHref ? (
                <>
                  {" "}
                  <a href={publicPreviewHref} className="text-baby-blue hover:underline">
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
            <p className="text-sm text-red-300" role="alert">
              {message}
            </p>
          ) : null}
        </form>
      ) : null}

      {items.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-2xl border border-white/10 bg-surface">
              {item.coverUrl ? <img src={item.coverUrl} alt="" className="h-44 w-full object-cover" /> : null}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl text-white">{item.title}</h2>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <StatusBadge label={item.status} tone={item.status === "published" ? "success" : "neutral"} />
                      <StatusBadge label={item.visibility} tone="info" />
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
                      className="text-white/35 hover:text-baby-blue"
                      aria-label={`Edit ${item.title}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(item.id)}
                      className="text-white/35 hover:text-red-300"
                      aria-label={`Delete ${item.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-3 line-clamp-3 text-sm text-white/50">{item.summary}</p>
                {item.projectUrl ? (
                  <a
                    href={item.projectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-sm text-baby-blue"
                  >
                    View evidence
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </div>
            </article>
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
