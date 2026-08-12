import { Button } from "@/components/ui/Button";

export function EmptyProof({
  title,
  body,
  href,
  label,
  secondaryHref,
  secondaryLabel,
}: {
  title: string;
  body: string;
  href?: string;
  label?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-surface p-7 sm:rounded-[1.75rem] sm:p-10">
      <h2 className="font-display text-xl text-white">{title}</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/50">{body}</p>
      {href && label ? (
        <div className="btn-row-mobile mt-6">
          <Button href={href} variant="secondary">
            {label}
          </Button>
          {secondaryHref && secondaryLabel ? (
            <Button href={secondaryHref}>{secondaryLabel}</Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

