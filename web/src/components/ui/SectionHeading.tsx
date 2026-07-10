import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  light?: boolean;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 text-[10px] font-medium uppercase tracking-[0.22em] sm:mb-4 sm:text-xs",
            light ? "text-deep-blue/80" : "text-baby-blue",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "font-display text-2xl leading-tight sm:text-3xl md:text-5xl",
          light ? "text-near-black" : "text-white",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-3 text-sm leading-relaxed sm:mt-5 sm:text-base md:text-lg",
            light ? "text-grey" : "text-white/70",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
