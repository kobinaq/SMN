"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const types = [
  "General enquiry",
  "Partnership",
  "Speaking request",
  "Talent request",
  "Other",
] as const;

export function ContactForm({ defaultType }: { defaultType?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/forms/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setStatus("success");
      setMessage("Message sent. We’ll get back to you soon.");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Unable to send. Try again.");
    }
  }

  const field =
    "field w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/35";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
      <div className="grid gap-4 md:grid-cols-2">
        <input className={field} name="name" required placeholder="Full name" />
        <input className={field} name="email" type="email" required placeholder="Email" />
      </div>
      <select
        className={cn(field, "bg-surface")}
        name="type"
        required
        defaultValue={defaultType ?? ""}
      >
        <option value="" disabled>
          Enquiry type
        </option>
        {types.map((type) => (
          <option key={type} value={type} className="bg-near-black">
            {type}
          </option>
        ))}
      </select>
      <textarea
        className={cn(field, "min-h-32")}
        name="message"
        required
        placeholder="How can we help?"
      />
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send message"}
      </Button>
      {message ? (
        <p className={cn("text-sm", status === "success" ? "text-mint" : "text-red-300")}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
