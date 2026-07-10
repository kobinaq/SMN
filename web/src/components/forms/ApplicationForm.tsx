"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const levels = ["Beginner", "Intermediate", "Advanced"] as const;

export function ApplicationForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/forms/cohort-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setStatus("success");
      setMessage("Application received. We'll email you within 3-5 business days.");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Unable to submit. Try again.");
    }
  }

  const field =
    "field w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/35 sm:py-3";

  return (
    <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <input className={field} name="name" required placeholder="Full name" autoComplete="name" />
        <input
          className={field}
          name="email"
          type="email"
          required
          placeholder="Email"
          autoComplete="email"
          inputMode="email"
        />
        <input
          className={field}
          name="phone"
          required
          placeholder="WhatsApp / phone"
          autoComplete="tel"
          inputMode="tel"
        />
        <input className={field} name="country" required placeholder="City / Country" />
        <input className={field} name="role" required placeholder="Current role" />
        <select className={cn(field, "bg-surface")} name="level" required defaultValue="">
          <option value="" disabled>
            Experience level
          </option>
          {levels.map((level) => (
            <option key={level} value={level} className="bg-near-black">
              {level}
            </option>
          ))}
        </select>
        <input className={field} name="linkedin" placeholder="LinkedIn URL" inputMode="url" />
        <input className={field} name="portfolio" placeholder="Portfolio URL (optional)" inputMode="url" />
      </div>
      <textarea
        className={cn(field, "min-h-28 resize-y")}
        name="goals"
        required
        placeholder="What do you want from this cohort?"
      />
      <input className={field} name="source" placeholder="How did you hear about SMN?" />
      <Button type="submit" disabled={status === "loading"} className="w-full md:w-auto">
        {status === "loading" ? "Submitting…" : "Submit application"}
      </Button>
      {message ? (
        <p
          className={cn(
            "text-sm",
            status === "success" ? "text-mint" : "text-red-300",
          )}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
