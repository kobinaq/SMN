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
    <div className=" border border-dashed border-edge bg-raised p-7 sm:p-10">
      <h2 className="font-display text-xl text-text-1">{title}</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-3">{body}</p>
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

