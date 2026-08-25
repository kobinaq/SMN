"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Surface";
import { Chip } from "@/components/ui/Chip";
import { Textarea } from "@/components/ui/Field";
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
    <Card as="section">
      <div className="flex items-center gap-2 text-accent">
        <MessageCircle className="h-4 w-4" />
        <h2 className="font-display text-lg text-text-1">Cohort discussion</h2>
      </div>
      <p className="mt-1 text-sm text-text-3">Ask questions and share with your cohort and facilitators.</p>

      <form onSubmit={onSubmit} className="mt-4">
        <Textarea
          value={body}
          maxLength={4000}
          placeholder="Write a message to your cohort…"
          onChange={(event) => setBody(event.target.value)}
        />
        <div className="mt-3 flex items-center gap-3">
          <Button type="submit" disabled={busy || !body.trim()}>
            {busy ? "Posting…" : "Post"}
          </Button>
          {error ? (
            <span className="text-xs text-danger" role="alert">
              {error}
            </span>
          ) : null}
        </div>
      </form>

      <div className="rise-stagger mt-5 space-y-3">
        {posts.length ? (
          posts.map((post, index) => (
            <article
              key={String(post.id)}
              style={{ "--i": index } as React.CSSProperties}
              className={`rise rounded-[var(--radius-md)] border p-4 ${
                post.authorRole === "staff" ? "border-accent/25 bg-accent-bg" : "border-edge-subtle bg-inset"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-text-1">{post.authorName}</span>
                {post.authorRole === "staff" ? (
                  <Chip tone="accent">Facilitator</Chip>
                ) : post.isSelf ? (
                  <Chip tone="neutral">You</Chip>
                ) : null}
                <span className="ml-auto text-xs text-text-3">{formatWhen(post.createdAt)}</span>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-text-2">{post.body}</p>
            </article>
          ))
        ) : (
          <p className="rounded-[var(--radius-md)] border border-dashed border-edge bg-inset px-4 py-6 text-center text-sm text-text-3">
            No messages yet. Start the conversation.
          </p>
        )}
      </div>
    </Card>
  );
}
