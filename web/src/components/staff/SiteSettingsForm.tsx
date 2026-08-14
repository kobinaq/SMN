"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { staffFieldClass } from "@/components/staff/ui";

type ImpactRow = { label: string; value: string; verified: boolean };

export type SiteSettingsFormValues = {
  siteName: string;
  tagline: string;
  description: string;
  whatsappInvite: string;
  opsEmail: string;
  announcementBanner: string;
  footerBlurb: string;
  homepageHeadline: string;
  homepageSupportingCopy: string;
  homepagePrimaryCtaLabel: string;
  homepageSecondaryCtaLabel: string;
  homepageSecondaryCtaHref: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  impactStats: ImpactRow[];
};

function Field({
  label,
  value,
  onChange,
  multiline,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  className?: string;
}) {
  return (
    <label className={`block text-sm text-white/70 ${className || ""}`}>
      {label}
      {multiline ? (
        <textarea
          className={`${staffFieldClass} min-h-28`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className={staffFieldClass}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}

export function SiteSettingsForm({ initial }: { initial: SiteSettingsFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  function setField<K extends keyof SiteSettingsFormValues>(name: K, value: SiteSettingsFormValues[K]) {
    setValues((current) => ({ ...current, [name]: value }));
  }

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
          description: values.description,
          whatsappInvite: values.whatsappInvite,
          opsEmail: values.opsEmail,
          announcementBanner: values.announcementBanner,
          footerBlurb: values.footerBlurb,
          homepage: {
            headline: values.homepageHeadline,
            supportingCopy: values.homepageSupportingCopy,
            primaryCtaLabel: values.homepagePrimaryCtaLabel,
            secondaryCtaLabel: values.homepageSecondaryCtaLabel,
            secondaryCtaHref: values.homepageSecondaryCtaHref,
          },
          social: {
            instagram: values.instagram,
            linkedin: values.linkedin,
            twitter: values.twitter,
          },
          impactStats: values.impactStats.filter((row) => row.label.trim() && row.value.trim()),
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

  return (
    <form onSubmit={submit} className="grid gap-8">
      <section className="grid gap-4 md:grid-cols-2">
        <h2 className="font-display text-lg text-white md:col-span-2">Brand</h2>
        <Field label="Site name" value={values.siteName} onChange={(value) => setField("siteName", value)} />
        <Field label="Operations email" value={values.opsEmail} onChange={(value) => setField("opsEmail", value)} />
        <Field
          label="Tagline"
          value={values.tagline}
          onChange={(value) => setField("tagline", value)}
          multiline
          className="md:col-span-2"
        />
        <Field
          label="Meta description"
          value={values.description}
          onChange={(value) => setField("description", value)}
          multiline
          className="md:col-span-2"
        />
        <Field
          label="WhatsApp invite URL"
          value={values.whatsappInvite}
          onChange={(value) => setField("whatsappInvite", value)}
          className="md:col-span-2"
        />
        <Field
          label="Announcement banner"
          value={values.announcementBanner}
          onChange={(value) => setField("announcementBanner", value)}
          className="md:col-span-2"
        />
        <Field
          label="Footer blurb"
          value={values.footerBlurb}
          onChange={(value) => setField("footerBlurb", value)}
          multiline
          className="md:col-span-2"
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <h2 className="font-display text-lg text-white md:col-span-2">Homepage</h2>
        <Field
          label="Headline"
          value={values.homepageHeadline}
          onChange={(value) => setField("homepageHeadline", value)}
          className="md:col-span-2"
        />
        <Field
          label="Supporting copy"
          value={values.homepageSupportingCopy}
          onChange={(value) => setField("homepageSupportingCopy", value)}
          multiline
          className="md:col-span-2"
        />
        <Field
          label="Primary CTA label"
          value={values.homepagePrimaryCtaLabel}
          onChange={(value) => setField("homepagePrimaryCtaLabel", value)}
        />
        <Field
          label="Secondary CTA label"
          value={values.homepageSecondaryCtaLabel}
          onChange={(value) => setField("homepageSecondaryCtaLabel", value)}
        />
        <Field
          label="Secondary CTA href"
          value={values.homepageSecondaryCtaHref}
          onChange={(value) => setField("homepageSecondaryCtaHref", value)}
          className="md:col-span-2"
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <h2 className="font-display text-lg text-white md:col-span-2">Social</h2>
        <Field label="Instagram" value={values.instagram} onChange={(value) => setField("instagram", value)} />
        <Field label="LinkedIn" value={values.linkedin} onChange={(value) => setField("linkedin", value)} />
        <Field label="Twitter / X" value={values.twitter} onChange={(value) => setField("twitter", value)} />
      </section>

      <section className="grid gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg text-white">Impact stats</h2>
          <Button
            type="button"
            variant="secondary"
            className="text-xs"
            onClick={() =>
              setField("impactStats", [...values.impactStats, { label: "", value: "", verified: false }])
            }
          >
            Add stat
          </Button>
        </div>
        <p className="text-sm text-white/45">Only verified rows appear on the public homepage.</p>
        {values.impactStats.length === 0 ? (
          <p className="text-sm text-white/40">None yet.</p>
        ) : (
          values.impactStats.map((row, index) => (
            <div key={index} className="grid gap-3 rounded-2xl border border-white/10 p-4 md:grid-cols-[1fr_1fr_auto_auto]">
              <input
                className={staffFieldClass}
                placeholder="Label"
                value={row.label}
                onChange={(event) => {
                  const next = [...values.impactStats];
                  next[index] = { ...row, label: event.target.value };
                  setField("impactStats", next);
                }}
              />
              <input
                className={staffFieldClass}
                placeholder="Value"
                value={row.value}
                onChange={(event) => {
                  const next = [...values.impactStats];
                  next[index] = { ...row, value: event.target.value };
                  setField("impactStats", next);
                }}
              />
              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={row.verified}
                  onChange={(event) => {
                    const next = [...values.impactStats];
                    next[index] = { ...row, verified: event.target.checked };
                    setField("impactStats", next);
                  }}
                />
                Verified
              </label>
              <Button
                type="button"
                variant="secondary"
                className="text-xs"
                onClick={() => setField("impactStats", values.impactStats.filter((_, i) => i !== index))}
              >
                Remove
              </Button>
            </div>
          ))
        )}
      </section>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? "Saving…" : "Save site settings"}
        </Button>
        {message ? <span className="text-sm text-white/50">{message}</span> : null}
      </div>
    </form>
  );
}
