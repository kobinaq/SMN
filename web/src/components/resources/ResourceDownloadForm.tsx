"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function ResourceDownloadForm({
  resourceTitle,
  resourceSlug,
}: {
  resourceTitle: string;
  resourceSlug: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      // Subscribe to newsletter + tag as resource download (Mailchimp when configured)
      const res = await fetch("/api/forms/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          website: data.website,
          resource: resourceSlug,
          resourceTitle,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setStatus("success");
      setMessage(
        "You're in. We'll email the resource shortly. Check your inbox (and spam) for SMN.",
      );
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Unable to send. Try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
      <label className="block text-xs uppercase tracking-wider text-white/40">
        Work email
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          name="email"
          type="email"
          required
          placeholder="you@company.com"
          autoComplete="email"
          inputMode="email"
          className="field min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/35"
        />
        <Button type="submit" disabled={status === "loading"} className="shrink-0 sm:min-w-[140px]">
          {status === "loading" ? "Sending…" : "Get free download"}
        </Button>
      </div>
      {message ? (
        <p
          className={cn(
            "text-sm leading-relaxed",
            status === "success" ? "text-mint" : "text-red-300",
          )}
        >
          {message}
        </p>
      ) : (
        <p className="text-xs text-white/35">
          Free for the community. We may also send occasional strategy notes. Unsubscribe anytime.
        </p>
      )}
    </form>
  );
}
