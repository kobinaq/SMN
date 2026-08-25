"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import type { CohortPost } from "@/lib/lms";

function formatWhen(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-GH", { dateStyle: "medium", timeStyle: "short" });
}

export function CohortDiscussion({ courseId, posts }: { courseId: string | number; posts: CohortPost[] }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = body.trim();
    if (!message) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/lms-discussion", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ courseId, body: message }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to post right now.");
      setBody("");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to post right now.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-surface p-5">
      <div className="flex items-center gap-2 text-baby-blue">
        <MessageCircle className="h-4 w-4" />
        <h2 className="font-display text-lg text-white">Cohort discussion</h2>
      </div>
      <p className="mt-1 text-sm text-white/45">Ask questions and share with your cohort and facilitators.</p>

      <form onSubmit={onSubmit} className="mt-4">
        <textarea
          className="min-h-24 w-full rounded-xl border border-white/12 bg-ink px-3.5 py-3 text-sm text-white placeholder:text-white/30 focus:border-baby-blue/45 focus:outline-none"
          value={body}
          maxLength={4000}
          placeholder="Write a message to your cohort…"
          onChange={(event) => setBody(event.target.value)}
        />
        <div className="mt-2 flex items-center gap-3">
          <Button type="submit" disabled={busy || !body.trim()}>
            {busy ? "Posting…" : "Post"}
          </Button>
          {error ? <span className="text-xs text-red-300" role="alert">{error}</span> : null}
        </div>
      </form>

      <div className="mt-5 space-y-3">
        {posts.length ? (
          posts.map((post) => (
            <article
              key={String(post.id)}
              className={`rounded-xl border p-4 ${post.authorRole === "staff" ? "border-baby-blue/25 bg-baby-blue/[.06]" : "border-white/10 bg-ink"}`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-white">{post.authorName}</span>
                {post.authorRole === "staff" ? (
                  <span className="rounded-full border border-baby-blue/30 px-2 py-0.5 text-[10px] uppercase tracking-wide text-baby-blue">Facilitator</span>
                ) : post.isSelf ? (
                  <span className="rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/45">You</span>
                ) : null}
                <span className="ml-auto text-xs text-white/35">{formatWhen(post.createdAt)}</span>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-white/70">{post.body}</p>
            </article>
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-white/12 bg-ink px-4 py-6 text-center text-sm text-white/40">
            No messages yet. Start the conversation.
          </p>
        )}
      </div>
    </section>
  );
}
