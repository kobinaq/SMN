"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Circle, X } from "lucide-react";

export type OnboardingStep = {
  key: string;
  label: string;
  href: string;
  done: boolean;
};

const STORAGE_KEY = "smn-onboarding-dismissed";

export function OnboardingChecklist({ steps }: { steps: OnboardingStep[] }) {
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      setDismissed(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      setDismissed(false);
    }
    setReady(true);
  }, []);

  const remaining = steps.filter((step) => !step.done);
  if (!ready || dismissed || !remaining.length) return null;

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setDismissed(true);
  }

  return (
    <section
      className="rounded-2xl border border-white/10 bg-surface p-5 sm:p-6"
      aria-labelledby="onboarding-heading"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">
            Getting started
          </p>
          <h2 id="onboarding-heading" className="mt-2 font-display text-xl text-white">
            Your first steps
          </h2>
          <p className="mt-1 text-sm text-white/50">
            Complete what helps — you can explore the platform anytime.
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-full border border-white/10 p-2 text-white/40 transition hover:text-white"
          aria-label="Dismiss getting started checklist"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <ol className="mt-5 space-y-2">
        {steps.map((step) => (
          <li key={step.key}>
            <Link
              href={step.href}
              className="flex items-center gap-3 rounded-xl border border-white/5 px-3 py-3 text-sm transition hover:border-baby-blue/30"
            >
              {step.done ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-mint" aria-hidden />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-white/35" aria-hidden />
              )}
              <span className={step.done ? "text-white/45 line-through" : "text-white/80"}>
                {step.label}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
