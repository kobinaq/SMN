"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { staffFieldClass } from "@/components/staff/ui";

export function SiteSettingsForm({ initial }: { initial: Record<string, string> }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/staff/settings", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          siteName: values.siteName,
          tagline: values.tagline,
          whatsappInvite: values.whatsappInvite,
          opsEmail: values.opsEmail,
          cohort: {
            name: values.cohortName,
            startDate: values.cohortStartDate,
            duration: values.cohortDuration,
            seats: values.cohortSeats ? Number(values.cohortSeats) : undefined,
            priceLabel: values.cohortPriceLabel,
            priceNote: values.cohortPriceNote,
            sessions: values.cohortSessions,
          },
          social: {
            instagram: values.instagram,
            linkedin: values.linkedin,
            twitter: values.twitter,
          },
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to save settings.");
      setMessage("Site settings saved.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save settings.");
    } finally {
      setBusy(false);
    }
  }

  const fields: Array<[keyof typeof values, string]> = [
    ["siteName", "Site name"],
    ["tagline", "Tagline"],
    ["whatsappInvite", "WhatsApp invite URL"],
    ["opsEmail", "Operations email"],
    ["cohortName", "Cohort name"],
    ["cohortStartDate", "Cohort start"],
    ["cohortDuration", "Cohort duration"],
    ["cohortSeats", "Cohort seats"],
    ["cohortPriceLabel", "Price label"],
    ["cohortPriceNote", "Price note"],
    ["cohortSessions", "Sessions"],
    ["instagram", "Instagram"],
    ["linkedin", "LinkedIn"],
    ["twitter", "Twitter / X"],
  ];

  return (
    <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
      {fields.map(([name, label]) => (
        <label key={name} className={`block text-sm text-white/70 ${name === "tagline" ? "md:col-span-2" : ""}`}>
          {label}
          {name === "tagline" ? (
            <textarea className={`${staffFieldClass} min-h-28`} value={values[name] || ""} onChange={(event) => setValues((current) => ({ ...current, [name]: event.target.value }))} />
          ) : (
            <input className={staffFieldClass} value={values[name] || ""} onChange={(event) => setValues((current) => ({ ...current, [name]: event.target.value }))} />
          )}
        </label>
      ))}
      <div className="md:col-span-2 flex items-center gap-3">
        <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save site settings"}</Button>
        {message ? <span className="text-sm text-white/50">{message}</span> : null}
      </div>
    </form>
  );
}
