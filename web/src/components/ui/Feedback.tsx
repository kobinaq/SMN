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
    <div className={cn("rounded-2xl border border-dashed border-white/15 bg-surface px-5 py-8 text-center", className)}>
      <p className="font-display text-lg text-white">{title}</p>
      {description ? <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/50">{description}</p> : null}
      {action ? <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div> : null}
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
    <div className="rounded-2xl border border-red-300/30 bg-red-400/10 px-5 py-6" role="alert">
      <p className="font-display text-lg text-red-100">{title}</p>
      {description ? <p className="mt-2 text-sm text-red-100/80">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}) {
  const tones = {
    neutral: "border-white/15 text-white/60",
    success: "border-mint/35 text-mint",
    warning: "border-amber-300/35 text-amber-100",
    danger: "border-red-300/35 text-red-100",
    info: "border-baby-blue/35 text-baby-blue",
  };
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wide", tones[tone])}>
      {label}
    </span>
  );
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
    <label htmlFor={htmlFor} className="block text-sm text-white/70">
      <span>{label}</span>
      <div className="mt-2">{children}</div>
      {hint && !error ? <span className="mt-1 block text-xs text-white/40">{hint}</span> : null}
      {error ? (
        <span className="mt-1 block text-xs text-red-200" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-white/10", className)} aria-hidden />;
}
