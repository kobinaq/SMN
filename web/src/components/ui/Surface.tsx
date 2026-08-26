import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * The resting panel used across the product. `interactive` adds the lift and
 * edge-brightening used by cards that navigate somewhere, so a clickable card
 * is visually distinguishable from a static one rather than relying on cursor.
 */
export function Card({
  as = "div",
  href,
  interactive,
  padded = true,
  className,
  children,
  style,
}: {
  as?: "div" | "article" | "section";
  href?: string;
  interactive?: boolean;
  padded?: boolean;
  className?: string;
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  const classes = cn(
    "rounded-[var(--radius-lg)] border border-edge-subtle bg-raised shadow-[var(--shadow-1)]",
    padded && "p-5",
    (interactive || href) && [
      "group transition-[transform,border-color,box-shadow] duration-[var(--dur-base)] ease-[var(--ease-out)]",
      "hover:-translate-y-0.5 hover:border-edge hover:shadow-[var(--shadow-2)]",
      "focus-visible:-translate-y-0.5 focus-visible:border-accent",
      "motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0",
    ],
    href && "block",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes} style={style}>
        {children}
      </Link>
    );
  }

  const Tag = as;
  return (
    <Tag className={classes} style={style}>
      {children}
    </Tag>
  );
}

/** Small uppercase label that sits above a heading. */
export function Eyebrow({
  children,
  tone = "accent",
  className,
}: {
  children: ReactNode;
  tone?: "accent" | "ai" | "muted";
  className?: string;
}) {
  const tones = {
    accent: "text-accent",
    ai: "text-ai",
    muted: "text-text-3",
  } as const;
  return <p className={cn("eyebrow", tones[tone], className)}>{children}</p>;
}

/** Page-level heading block — eyebrow, title, supporting line, optional action. */
export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h1 className="mt-2 font-display text-2xl text-text-1 sm:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-2">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

/** Metric tile. Numbers use tabular figures so rows of them line up. */
export function Stat({
  label,
  value,
  tone = "default",
  className,
}: {
  label: string;
  value: ReactNode;
  tone?: "default" | "accent" | "ai";
  className?: string;
}) {
  const tones = {
    default: "text-text-1",
    accent: "text-accent",
    ai: "text-ai",
  } as const;
  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] border border-edge-subtle bg-raised px-4 py-3",
        className,
      )}
    >
      <p className={cn("tnum font-display text-2xl leading-none", tones[tone])}>{value}</p>
      <p className="mt-1.5 text-xs text-text-3">{label}</p>
    </div>
  );
}

/**
 * Linear progress. Rounded track + accent fill, animated on width change so
 * progress visibly moves rather than teleporting between renders.
 */
export function ProgressBar({
  value,
  tone = "accent",
  className,
  label,
}: {
  value: number;
  tone?: "accent" | "ai";
  className?: string;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      className={cn("h-1.5 overflow-hidden rounded-full bg-inset", className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-[var(--dur-slow)] ease-[var(--ease-out)]",
          tone === "ai" ? "bg-ai" : "bg-accent",
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

/**
 * Circular progress for "N of M" stats, where a ring reads more naturally as
 * a count toward a whole than a bar does.
 */
export function ProgressRing({
  value,
  size = 72,
  tone = "ai",
  children,
}: {
  value: number;
  size?: number;
  tone?: "accent" | "ai";
  children?: ReactNode;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          className="stroke-inset"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            "transition-[stroke-dashoffset] duration-[var(--dur-slow)] ease-[var(--ease-out)]",
            tone === "ai" ? "stroke-ai" : "stroke-accent",
          )}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children ?? <span className="tnum font-display text-base text-text-1">{clamped}%</span>}
      </div>
    </div>
  );
}
