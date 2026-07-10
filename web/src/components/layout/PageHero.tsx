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
    <section
      className={cn(
        "bg-near-black pt-[calc(5.5rem+env(safe-area-inset-top))] pb-12 sm:pt-32 sm:pb-16 md:pt-40 md:pb-20",
        className,
      )}
    >
      <div className="container-wide max-w-4xl">
        {eyebrow ? (
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue sm:mb-4 sm:text-xs">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-[1.75rem] leading-tight text-white sm:text-4xl md:text-6xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 sm:mt-6 sm:text-base md:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
