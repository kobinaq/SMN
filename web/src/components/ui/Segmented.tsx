"use client";

import { cn } from "@/lib/utils";

export type SegmentedOption<T extends string> = { value: T; label: string };

/**
 * Segmented control for switching between a small set of peer modes.
 * The active pill is a sliding element rather than a per-option background,
 * so changing selection reads as one thing moving instead of two things
 * blinking — the detail that makes this feel considered rather than abrupt.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  tone = "accent",
  className,
  "aria-label": ariaLabel,
}: {
  options: ReadonlyArray<SegmentedOption<T>>;
  value: T;
  onChange: (value: T) => void;
  tone?: "accent" | "ai";
  className?: string;
  "aria-label"?: string;
}) {
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn("relative inline-flex w-full rounded-full bg-inset p-1", className)}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-1 rounded-full transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] motion-reduce:transition-none",
          tone === "ai" ? "bg-ai" : "bg-accent",
        )}
        style={{
          width: `calc((100% - 0.5rem) / ${options.length})`,
          transform: `translateX(calc(${activeIndex} * 100%))`,
        }}
      />
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative z-10 flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors duration-[var(--dur-fast)]",
              active
                ? tone === "ai"
                  ? "text-[#07160f]"
                  : "text-[#08111f]"
                : "text-text-2 hover:text-text-1",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
