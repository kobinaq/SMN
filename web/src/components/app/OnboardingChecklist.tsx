"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { CheckCircle2, Circle, X } from "@/components/ui/icons";

export type OnboardingStep = {
  key: string;
  label: string;
  href: string;
  done: boolean;
};

const STORAGE_KEY = "smn-onboarding-dismissed";

const emptySubscribe = () => () => {};

export function OnboardingChecklist({ steps }: { steps: OnboardingStep[] }) {
  // `mounted` is false during SSR and the first client (hydration) render, then
  // true afterwards — a hydration-safe two-pass without setState in an effect.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  // Read the persisted dismissal lazily; only applied after mount.
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });

  const remaining = steps.filter((step) => !step.done);
  if (!mounted || dismissed || !remaining.length) return null;

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
      className="rise rounded-[var(--radius-lg)] border border-edge-subtle bg-raised p-5 shadow-[var(--shadow-1)] sm:p-6"
      aria-labelledby="onboarding-heading"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow text-accent">Getting started</p>
          <h2 id="onboarding-heading" className="mt-2 font-display text-xl text-text-1">
            Your first steps
          </h2>
          <p className="mt-1 text-sm text-text-3">Complete what helps — you can explore the platform anytime.</p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-full border border-edge-subtle p-2 text-text-3 transition-colors hover:text-text-1"
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
              className="flex items-center gap-3 rounded-[var(--radius-md)] border border-edge-subtle px-3 py-3 text-sm transition-colors duration-[var(--dur-fast)] hover:border-accent/35"
            >
              {step.done ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-ai" aria-hidden />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-text-3" aria-hidden />
              )}
              <span className={step.done ? "text-text-3 line-through" : "text-text-1"}>{step.label}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
