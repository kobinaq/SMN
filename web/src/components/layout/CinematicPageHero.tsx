import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function CinematicPageHero({
  image,
  alt,
  kicker,
  title,
  description,
  actions,
  meta,
  imageClassName,
  priority = true,
  size = "default",
}: {
  image: string;
  alt: string;
  kicker: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  meta?: ReactNode;
  imageClassName?: string;
  priority?: boolean;
  size?: "default" | "compact";
}) {
  const minH =
    size === "compact"
      ? "min-h-[64svh] sm:min-h-[72svh]"
      : "min-h-[72svh] sm:min-h-[82svh]";
  const innerMinH =
    size === "compact"
      ? "min-h-[calc(64svh-5.5rem)] sm:min-h-[calc(72svh-7rem)]"
      : "min-h-[calc(72svh-5.5rem)] sm:min-h-[calc(82svh-7rem)]";

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-white/10 bg-near-black pt-[calc(5.5rem+env(safe-area-inset-top))] sm:pt-28",
        minH,
      )}
    >
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={alt}
          fill
          priority={priority}
          className={cn("object-cover object-center", imageClassName)}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-near-black via-near-black/90 to-near-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-near-black via-transparent to-near-black/40" />
      </div>

      <div
        className={cn(
          "container-wide relative z-10 flex flex-col justify-end pb-14 sm:pb-20",
          innerMinH,
        )}
      >
        <p className="font-display text-sm tracking-[0.08em] text-baby-blue sm:text-base">
          {kicker}
        </p>
        <h1 className="mt-4 max-w-3xl text-balance font-display text-[2.2rem] leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base md:text-lg">
            {description}
          </p>
        ) : null}
        {actions ? <div className="btn-row-mobile mt-8">{actions}</div> : null}
        {meta ? (
          <div className="mt-5 text-xs uppercase tracking-[0.14em] text-white/40">{meta}</div>
        ) : null}
      </div>
    </section>
  );
}
