"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import type { PortfolioItem } from "@/lib/portfolios";
import { Button } from "@/components/ui/Button";

const field = "field w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/35";

export function PortfolioManager({ initial }: { initial: PortfolioItem[] }) {
  const [items, setItems] = useState(initial);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setState("loading"); setMessage("");
    const response = await fetch("/api/portfolios", { method: "POST", body: new FormData(event.currentTarget) });
    const json = await response.json().catch(() => ({})) as { error?: string };
    if (!response.ok) { setState("error"); setMessage(json.error || "Unable to save."); return; }
    location.reload();
  }

  async function remove(id: string | number) {
    if (!confirm("Delete this case study?")) return;
    const response = await fetch(`/api/portfolios?id=${id}`, { method: "DELETE" });
    if (response.ok) setItems((current) => current.filter((item) => item.id !== id));
  }

  return <div className="space-y-5">
    <div className="flex justify-end"><Button type="button" onClick={() => setOpen((value) => !value)}><Plus className="h-4 w-4" />{open ? "Close form" : "Add case study"}</Button></div>
    {open ? <form onSubmit={submit} className="space-y-4 rounded-2xl border border-white/10 bg-surface p-5 sm:p-7">
      <div className="grid gap-3 sm:grid-cols-2"><input className={field} name="title" required minLength={3} placeholder="Project title" /><input className={field} name="skills" placeholder="Skills, comma separated" /></div>
      <textarea className={`${field} min-h-24`} name="summary" required minLength={20} placeholder="Short project summary" />
      <textarea className={`${field} min-h-28`} name="challenge" required minLength={20} placeholder="What was the challenge?" />
      <textarea className={`${field} min-h-28`} name="approach" required minLength={20} placeholder="What approach did you take?" />
      <textarea className={`${field} min-h-28`} name="outcome" required minLength={20} placeholder="What changed or what did you learn?" />
      <div className="grid gap-3 sm:grid-cols-2"><input className={field} name="projectUrl" type="url" placeholder="Project URL (optional)" /><input className={field} name="coverUrl" type="url" placeholder="Cover image URL (optional)" /></div>
      <div className="space-y-1"><input className={field} name="cover" type="file" accept="image/*" /><p className="text-xs text-white/40">Upload an image up to 10 MB, or use the cover-image URL above.</p></div>
      <div className="grid gap-3 sm:grid-cols-2"><select className={`${field} bg-surface`} name="status" defaultValue="draft"><option value="draft">Draft</option><option value="published">Published</option></select><select className={`${field} bg-surface`} name="visibility" defaultValue="private"><option value="private">Private</option><option value="members">Members only</option><option value="public">Public</option></select></div>
      <Button type="submit" disabled={state === "loading"}>{state === "loading" ? "Saving�" : "Save case study"}</Button>{message ? <p className="text-sm text-red-300">{message}</p> : null}
    </form> : null}
    {items.length ? <div className="grid gap-4 md:grid-cols-2">{items.map((item) => <article key={item.id} className="overflow-hidden rounded-2xl border border-white/10 bg-surface">{item.coverUrl ? <img src={item.coverUrl} alt="" className="h-44 w-full object-cover" /> : null}<div className="p-5"><div className="flex items-start justify-between gap-3"><div><h2 className="font-display text-xl text-white">{item.title}</h2><p className="mt-1 text-xs capitalize text-baby-blue">{item.status} � {item.visibility}</p></div><button type="button" onClick={() => remove(item.id)} className="text-white/35 hover:text-red-300" aria-label={`Delete ${item.title}`}><Trash2 className="h-4 w-4" /></button></div><p className="mt-3 line-clamp-3 text-sm text-white/50">{item.summary}</p>{item.projectUrl ? <a href={item.projectUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm text-baby-blue">View project <ExternalLink className="h-3.5 w-3.5" /></a> : null}</div></article>)}</div> : <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-white/50">Add your first case study to show how you think and what you delivered.</div>}
  </div>;
}