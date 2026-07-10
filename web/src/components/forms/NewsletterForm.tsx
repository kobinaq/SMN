"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function NewsletterForm({ className }: { className?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/forms/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setStatus("success");
      setMessage("You’re on the list.");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Unable to subscribe.");
    }
  }

  return (
    <form onSubmit={onSubmit} className={cn("flex flex-col gap-3 sm:flex-row", className)}>
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
      <input
        name="email"
        type="email"
        required
        placeholder="Email address"
        className="field min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white placeholder:text-white/35"
      />
      <Button type="submit" disabled={status === "loading"} className="shrink-0">
        {status === "loading" ? "…" : "Subscribe"}
      </Button>
      {message ? (
        <p className={cn("text-sm sm:basis-full", status === "success" ? "text-mint" : "text-red-300")}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
