"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { cta } from "@/lib/cta";

const levels = ["Beginner", "Intermediate", "Advanced"] as const;

export function ApplicationForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [submittedKey, setSubmittedKey] = useState("");

  useEffect(() => {
    trackEvent("application_start", { location: "apply_page" });
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const dedupeKey = `${String(data.email || "").toLowerCase()}::${String(data.name || "")}`;
    if (submittedKey && submittedKey === dedupeKey) {
      setStatus("error");
      setMessage("This application was already submitted in this session. Check your email or contact SMN if you need to update it.");
      return;
    }

    try {
      const res = await fetch("/api/forms/cohort-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setStatus("success");
      setSubmittedKey(dedupeKey);
      setMessage("");
      trackEvent("application_complete", { location: "apply_page" });
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Unable to submit. Try again.");
      trackEvent("application_error", { location: "apply_page" });
    }
  }

  const field =
    "field w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/35 sm:py-3";

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-mint/25 bg-mint/5 p-6 text-sm leading-relaxed text-white/80">
        <p className="font-display text-2xl text-white">Application received</p>
        <p className="mt-4">
          Thank you. Your cohort application has been submitted. We will email you within{" "}
          <strong className="text-white">3–5 business days</strong> with a decision or follow-up
          questions.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-white/65">
          <li>No payment is due until after acceptance.</li>
          <li>Check your inbox (and spam folder) for confirmation from SMN.</li>
          <li>If you do not hear back after five business days, contact us.</li>
        </ul>
        <div className="btn-row-mobile mt-6">
          <Button href="/programs/cohort" variant="secondary">
            Review cohort details
          </Button>
          <Button href="/contact" variant="ghost">
            Contact support
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4" noValidate>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs text-white/50" htmlFor="apply-name">
            Full name
          </label>
          <input
            id="apply-name"
            className={field}
            name="name"
            required
            minLength={2}
            placeholder="Full name"
            autoComplete="name"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-white/50" htmlFor="apply-email">
            Email
          </label>
          <input
            id="apply-email"
            className={field}
            name="email"
            type="email"
            required
            placeholder="Email"
            autoComplete="email"
            inputMode="email"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-white/50" htmlFor="apply-phone">
            WhatsApp / phone
          </label>
          <input
            id="apply-phone"
            className={field}
            name="phone"
            required
            placeholder="WhatsApp / phone"
            autoComplete="tel"
            inputMode="tel"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-white/50" htmlFor="apply-country">
            City / country
          </label>
          <input
            id="apply-country"
            className={field}
            name="country"
            required
            placeholder="City / Country"
            autoComplete="address-level2"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-white/50" htmlFor="apply-role">
            Current role
          </label>
          <input id="apply-role" className={field} name="role" required placeholder="Current role" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-white/50" htmlFor="apply-level">
            Experience level
          </label>
          <Select
            id="apply-level"
            className={cn(field, "bg-surface")}
            name="level"
            required
            defaultValue=""
          >
            <option value="" disabled>
              Experience level
            </option>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-white/50" htmlFor="apply-linkedin">
            LinkedIn URL (optional)
          </label>
          <input
            id="apply-linkedin"
            className={field}
            name="linkedin"
            placeholder="LinkedIn URL"
            inputMode="url"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-white/50" htmlFor="apply-portfolio">
            Portfolio URL (optional)
          </label>
          <input
            id="apply-portfolio"
            className={field}
            name="portfolio"
            placeholder="Portfolio URL"
            inputMode="url"
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs text-white/50" htmlFor="apply-goals">
          What do you want from this cohort?
        </label>
        <textarea
          id="apply-goals"
          className={cn(field, "min-h-28 resize-y")}
          name="goals"
          required
          minLength={20}
          placeholder="What do you want from this cohort?"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs text-white/50" htmlFor="apply-source">
          How did you hear about SMN? (optional)
        </label>
        <input
          id="apply-source"
          className={field}
          name="source"
          placeholder="How did you hear about SMN?"
        />
      </div>
      <Button type="submit" disabled={status === "loading"} className="w-full md:w-auto">
        {status === "loading" ? "Submitting…" : cta.submitApplication.label}
      </Button>
      {message ? (
        <p className={cn("text-sm", status === "error" ? "text-red-300" : "text-mint")} role="alert">
          {message}
        </p>
      ) : null}
    </form>
  );
}
