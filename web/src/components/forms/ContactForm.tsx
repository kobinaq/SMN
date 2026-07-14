"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

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
  const isEmployer = defaultType === "Talent request" || defaultType === "Partnership";

  useEffect(() => {
    if (isEmployer) trackEvent("employer_enquiry_start", { location: "contact_form" });
  }, [isEmployer]);

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
      if (isEmployer) trackEvent("employer_enquiry_complete", { location: "contact_form" });
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Unable to send. Try again.");
    }
  }

  const field =
    "field w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/35 sm:py-3";

  return (
    <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs text-white/50" htmlFor="contact-name">
            Full name
          </label>
          <input
            id="contact-name"
            className={field}
            name="name"
            required
            placeholder="Full name"
            autoComplete="name"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-white/50" htmlFor="contact-email">
            Email
          </label>
          <input
            id="contact-email"
            className={field}
            name="email"
            type="email"
            required
            placeholder="Email"
            autoComplete="email"
            inputMode="email"
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs text-white/50" htmlFor="contact-type">
          Enquiry type
        </label>
        <Select
          id="contact-type"
          className={cn(field, "bg-surface")}
          name="type"
          required
          defaultValue={defaultType ?? ""}
        >
          <option value="" disabled>
            Enquiry type
          </option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <label className="mb-1.5 block text-xs text-white/50" htmlFor="contact-message">
          Message
        </label>
        <textarea
          id="contact-message"
          className={cn(field, "min-h-32 resize-y")}
          name="message"
          required
          minLength={10}
          placeholder="How can we help?"
        />
      </div>
      <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
        {status === "loading" ? "Sending…" : "Send message"}
      </Button>
      {message ? (
        <p
          className={cn("text-sm", status === "success" ? "text-mint" : "text-red-300")}
          role="alert"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
