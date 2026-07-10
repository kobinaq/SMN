import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <section className={cn("bg-near-black pt-32 pb-16 md:pt-40 md:pb-20", className)}>
      <div className="container-wide max-w-4xl">
        {eyebrow ? (
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-baby-blue">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-4xl leading-tight text-white md:text-6xl">{title}</h1>
        {description ? (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 md:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
