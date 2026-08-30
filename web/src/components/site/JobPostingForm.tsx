"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

const field =
  "field w-full border border-edge-subtle bg-inset px-4 py-3.5 text-text-1 placeholder:text-text-3 sm:py-3";

const TYPES = ["Full-time", "Part-time", "Contract", "Freelance", "Internship", "Volunteer"] as const;
const WORK_MODES = ["Remote", "Hybrid", "On-site", "Unspecified"] as const;
const LEVELS = ["Entry level", "Mid-level", "Senior", "Lead / Head", "Any level"] as const;

function Labelled({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs text-text-3" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}

/**
 * Structured intake for employer job postings. Every field maps onto the
 * `opportunities` collection, so a submission becomes a pending listing in the
 * staff Jobs queue rather than a freeform email someone has to re-key.
 */
export function JobPostingForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("loading");
    setMessage("");
    trackEvent("employer_enquiry_start", { location: "job_posting_form" });
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/forms/job-posting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setStatus("success");
      setMessage("Thanks — your listing is with our team for review. We'll be in touch if we need anything.");
      trackEvent("employer_enquiry_complete", { location: "job_posting_form" });
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Unable to submit. Try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-ai/30 bg-ai-bg p-6 sm:p-8" role="status">
        <h3 className="font-display text-xl text-text-1">Listing received</h3>
        <p className="mt-3 text-sm leading-relaxed text-text-2">{message}</p>
        <Button className="mt-6" variant="secondary" type="button" onClick={() => setStatus("idle")}>
          Post another role
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <Labelled label="Company" htmlFor="job-company">
          <input id="job-company" className={field} name="company" required maxLength={160} placeholder="Company name" />
        </Labelled>
        <Labelled label="Role title" htmlFor="job-title">
          <input id="job-title" className={field} name="title" required maxLength={180} placeholder="e.g. Social Media Manager" />
        </Labelled>
      </div>

      <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
        <Labelled label="Employment type" htmlFor="job-type">
          <Select id="job-type" className={cn(field, "bg-raised")} name="type" required defaultValue="Full-time">
            {TYPES.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </Select>
        </Labelled>
        <Labelled label="Work mode" htmlFor="job-mode">
          <Select id="job-mode" className={cn(field, "bg-raised")} name="workMode" required defaultValue="Remote">
            {WORK_MODES.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </Select>
        </Labelled>
        <Labelled label="Experience level" htmlFor="job-level">
          <Select id="job-level" className={cn(field, "bg-raised")} name="experienceLevel" required defaultValue="Any level">
            {LEVELS.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </Select>
        </Labelled>
      </div>

      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <Labelled label="Location" htmlFor="job-location">
          <input id="job-location" className={field} name="location" required maxLength={160} placeholder="e.g. Accra, Ghana or Remote (EMEA)" />
        </Labelled>
        <Labelled label="Salary or range (optional)" htmlFor="job-salary">
          <input id="job-salary" className={field} name="salary" maxLength={160} placeholder="e.g. GH₵5,000–7,000 / month" />
        </Labelled>
      </div>

      <Labelled label="How should candidates apply? (link or email)" htmlFor="job-apply">
        <input id="job-apply" className={field} name="applyTo" required maxLength={400} placeholder="https://careers.company.com/role  ·  or  jobs@company.com" />
      </Labelled>

      <Labelled label="Role description" htmlFor="job-description">
        <textarea
          id="job-description"
          className={cn(field, "min-h-40 resize-y")}
          name="description"
          required
          minLength={30}
          maxLength={8000}
          placeholder="What the role involves, the team, what success looks like in the first 30–90 days, and who it's a fit for."
        />
      </Labelled>

      <div className="rule pt-5">
        <p className="eyebrow text-text-3">Your details</p>
        <p className="mt-1 text-xs text-text-3">So we can follow up before the listing goes live. Not shown publicly.</p>
        <div className="mt-3 grid gap-3 sm:gap-4 md:grid-cols-2">
          <Labelled label="Your name" htmlFor="job-poster-name">
            <input id="job-poster-name" className={field} name="posterName" required maxLength={120} placeholder="Full name" autoComplete="name" />
          </Labelled>
          <Labelled label="Your email" htmlFor="job-poster-email">
            <input id="job-poster-email" className={field} name="posterEmail" type="email" required placeholder="you@company.com" autoComplete="email" inputMode="email" />
          </Labelled>
        </div>
      </div>

      <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
        {status === "loading" ? "Submitting…" : "Submit for review"}
      </Button>
      {message && status === "error" ? (
        <p className="text-sm text-red-300" role="alert">{message}</p>
      ) : null}
    </form>
  );
}
