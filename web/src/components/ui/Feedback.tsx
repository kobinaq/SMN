import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-dashed border-edge bg-raised px-5 py-10 text-center",
        className,
      )}
    >
      <p className="font-display text-lg text-text-1">{title}</p>
      {description ? <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-2">{description}</p> : null}
      {action ? <div className="mt-6 flex flex-wrap justify-center gap-2">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className=" border border-red-300/30 bg-red-400/10 px-5 py-6" role="alert">
      <p className="font-display text-lg text-red-100">{title}</p>
      {description ? <p className="mt-2 text-sm text-red-100/80">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

/**
 * Semantic status label. Kept as a thin mapping over Chip so the product has
 * one pill implementation — this exists for its status vocabulary
 * (success/warning/info), not a second set of styles.
 */
export function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}) {
  const toChipTone = {
    neutral: "neutral",
    success: "ai",
    warning: "warn",
    danger: "danger",
    info: "accent",
  } as const;
  return <Chip tone={toChipTone[tone]}>{label}</Chip>;
}

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm text-text-2">
      <span>{label}</span>
      <div className="mt-2">{children}</div>
      {hint && !error ? <span className="mt-1 block text-xs text-text-3">{hint}</span> : null}
      {error ? (
        <span className="mt-1 block text-xs text-red-200" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-white/10", className)} aria-hidden />;
}
