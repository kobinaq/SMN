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
  const [downloadUrl, setDownloadUrl] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    setDownloadUrl("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/forms/resource-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          website: data.website,
          resource: resourceSlug,
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        delivered?: boolean;
        downloadUrl?: string;
      };
      if (json.downloadUrl) setDownloadUrl(json.downloadUrl);
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setStatus("success");
      setMessage(
        json.delivered
          ? `${resourceTitle} is on its way to your inbox. Check spam if you don't see it.`
          : `${resourceTitle} is ready. Use the link below.`,
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
      <label
        htmlFor="resource-download-email"
        className="block text-xs tracking-wider text-white/40 uppercase"
      >
        Work email
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="resource-download-email"
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
        <div className="space-y-2">
          <p
            className={cn(
              "text-sm leading-relaxed",
              status === "success" ? "text-mint" : "text-red-300",
            )}
          >
            {message}
          </p>
          {downloadUrl ? (
            <a
              href={downloadUrl}
              className="inline-flex min-h-10 items-center text-sm font-medium text-baby-blue underline underline-offset-4 transition hover:text-white"
            >
              Open {resourceTitle}
            </a>
          ) : null}
        </div>
      ) : (
        <p className="text-xs text-white/35">
          Free for the community. We may also send occasional strategy notes. Unsubscribe anytime.
        </p>
      )}
    </form>
  );
}
