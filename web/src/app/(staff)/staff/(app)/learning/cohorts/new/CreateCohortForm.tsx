"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { staffFieldClass, StaffFormField } from "@/components/staff/ui";
import { Select } from "@/components/ui/Select";

/**
 * Create a cohort with only what the public site needs to market it.
 *
 * Google Classroom links, curriculum and sessions come later from the cohort's
 * workspace — none of them are needed to put an intake in front of applicants,
 * so this form deliberately does not ask for them.
 */
export function CreateCohortForm() {
  const router = useRouter();
  const [commerce, setCommerce] = useState<"apply" | "purchase">("apply");
  const [priceConfirmed, setPriceConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const text = (key: string) => String(form.get(key) || "").trim();

    const commerceValue = text("commerce") === "purchase" ? "purchase" : "apply";
    const seatsRaw = text("seats");

    try {
      const response = await fetch("/api/staff/records", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          collection: "lms-courses",
          action: "create",
          data: {
            title: text("title"),
            slug: text("slug") || undefined,
            summary: text("summary"),
            programKey: text("programKey"),
            status: "draft",
            accessRule: "enrolled",
            delivery: "cohort",
            commerce: commerceValue,
            startDate: text("startDate") || undefined,
            applicationDeadline: text("applicationDeadline") || undefined,
            duration: text("duration") || undefined,
            format: text("format") || undefined,
            sessions: text("sessions") || undefined,
            audience: text("audience") || undefined,
            seats: seatsRaw ? Number(seatsRaw) : undefined,
            priceConfirmed: form.get("priceConfirmed") === "on",
            priceLabel: text("priceLabel") || undefined,
            priceNote: text("priceNote") || undefined,
            featured: form.get("featured") === "on",
            enrollmentOpen: form.get("enrollmentOpen") === "on",
          },
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to create cohort.");
      router.push(`/staff/learning/courses/${result.id}?tab=overview`);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create cohort.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <StaffFormField label="Cohort name">
        <input className={staffFieldClass} name="title" required maxLength={200} placeholder="e.g. Social Media Marketing & AI — September 2026" />
      </StaffFormField>
      <StaffFormField label="Slug">
        <input className={staffFieldClass} name="slug" maxLength={80} placeholder="auto-from-name if blank" />
      </StaffFormField>
      <StaffFormField label="Summary">
        <textarea className={staffFieldClass} name="summary" required rows={3} placeholder="One or two sentences shown on the public listing." />
      </StaffFormField>
      <StaffFormField label="Program key">
        <input className={staffFieldClass} name="programKey" required maxLength={120} placeholder="e.g. cohort-2026-sept" />
      </StaffFormField>

      <StaffFormField label="How people join">
        <Select
          className={staffFieldClass}
          name="commerce"
          value={commerce}
          onChange={(event) => setCommerce(event.target.value === "purchase" ? "purchase" : "apply")}
        >
          <option value="apply">Apply first</option>
          <option value="purchase">Buy now (Paystack)</option>
        </Select>
      </StaffFormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <StaffFormField label="Starts (public)">
          <input className={staffFieldClass} name="startDate" placeholder="September 2026" />
        </StaffFormField>
        <StaffFormField label="Application deadline">
          <input className={staffFieldClass} name="applicationDeadline" placeholder="Rolling. Apply early" />
        </StaffFormField>
        <StaffFormField label="Duration">
          <input className={staffFieldClass} name="duration" placeholder="8 weeks" />
        </StaffFormField>
        <StaffFormField label="Seats">
          <input className={staffFieldClass} name="seats" type="number" min={0} placeholder="30" />
        </StaffFormField>
        <StaffFormField label="Format">
          <input className={staffFieldClass} name="format" placeholder="Online, live sessions" />
        </StaffFormField>
        <StaffFormField label="Sessions">
          <input className={staffFieldClass} name="sessions" placeholder="Weekly live sessions, Saturdays" />
        </StaffFormField>
      </div>

      <StaffFormField label="Who it is for">
        <textarea className={staffFieldClass} name="audience" rows={2} placeholder="Aspiring and early-career marketers moving from content to strategy." />
      </StaffFormField>

      <div className="rounded-[var(--radius-md)] border border-edge-subtle p-4">
        <label className="flex items-start gap-3 text-sm text-text-2">
          <input
            className="mt-1 h-4 w-4 accent-accent"
            type="checkbox"
            name="priceConfirmed"
            checked={priceConfirmed}
            onChange={(event) => setPriceConfirmed(event.target.checked)}
          />
          <span>Fee is confirmed and can be shown publicly</span>
        </label>
        {priceConfirmed ? (
          <div className="mt-4 grid gap-4">
            <StaffFormField label="Public fee">
              <input className={staffFieldClass} name="priceLabel" placeholder="GH₵2,500" />
            </StaffFormField>
            <StaffFormField label="Fee note (optional)">
              <textarea className={staffFieldClass} name="priceNote" rows={2} placeholder="Payment plans available. Payment comes after acceptance." />
            </StaffFormField>
          </div>
        ) : (
          <p className="mt-2 text-xs text-text-3">
            While unconfirmed, the site shows “Contact SMN for current fees”.
          </p>
        )}
      </div>

      <label className="flex items-start gap-3 text-sm text-text-2">
        <input className="mt-1 h-4 w-4 accent-accent" type="checkbox" name="enrollmentOpen" defaultChecked />
        <span>Open for applications</span>
      </label>
      <label className="flex items-start gap-3 text-sm text-text-2">
        <input className="mt-1 h-4 w-4 accent-accent" type="checkbox" name="featured" />
        <span>Show as the next intake on the homepage and apply page</span>
      </label>

      <p className="text-xs leading-relaxed text-text-3">
        Saved as a draft. Add the session plan, Google Classroom invite and any curriculum from the
        cohort&rsquo;s workspace. It only appears on the marketing site once you publish it.
      </p>

      {error ? (
        <p className="rounded-[var(--radius-md)] border border-danger/30 bg-danger-bg px-4 py-3 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-accent-strong px-5 py-2.5 text-sm font-semibold text-[#08111f] transition-colors duration-[var(--dur-fast)] hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
      >
        {busy ? "Creating…" : "Create cohort"}
      </button>
    </form>
  );
}
