import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type ChipTone = "neutral" | "accent" | "ai" | "warn" | "danger";

const tones: Record<ChipTone, string> = {
  neutral: "border-edge-subtle bg-inset text-text-2",
  accent: "border-transparent bg-accent-bg text-accent",
  ai: "border-transparent bg-ai-bg text-ai",
  warn: "border-transparent bg-warn-bg text-warn",
  danger: "border-transparent bg-danger-bg text-danger",
};

/**
 * Status/metadata pill. Tone carries meaning (see the color roles in
 * globals.css) — pick by what the label means, not by what looks good.
 */
export function Chip({
  children,
  tone = "neutral",
  icon,
  className,
}: {
  children: ReactNode;
  tone?: ChipTone;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
