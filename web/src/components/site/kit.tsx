import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/**
 * Marketing kit.
 *
 * The public site speaks louder than the member portal: oversized display
 * type, flat bands of colour, visible rules, numbered sequences. It runs on
 * the same tokens as the rest of the app — the difference is scale and
 * contrast, not a second palette.
 *
 * The one rule worth stating: a page is a stack of `Band`s. A band owns its
 * ground colour and its vertical rhythm, so pages never hand-roll padding or
 * background classes and two adjacent sections can never disagree about
 * either.
 */

type Tone = "canvas" | "raised" | "blue" | "light";

const toneClass: Record<Tone, string> = {
  canvas: "bg-canvas",
  raised: "bg-raised",
  blue: "band-blue bg-canvas",
  light: "band-light bg-canvas",
};

const sizeClass = {
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-24",
  lg: "py-20 sm:py-32",
} as const;

export function Band({
  children,
  tone = "canvas",
  size = "md",
  className,
  id,
  bordered = true,
  fade = false,
}: {
  children: ReactNode;
  tone?: Tone;
  size?: keyof typeof sizeClass;
  className?: string;
  id?: string;
  /** Hairline between bands. Off when the next band supplies its own edge. */
  bordered?: boolean;
  /** Opt into the home page's scroll-linked fade (see HomeStory). */
  fade?: boolean;
}) {
  return (
    <section
      id={id}
      data-section-fade={fade || undefined}
      className={cn(
        toneClass[tone],
        sizeClass[size],
        bordered && "border-b border-edge-subtle",
        className,
      )}
    >
      <div className="container-wide">{children}</div>
    </section>
  );
}

/** Small uppercase label with the rule that anchors it to the grid. */
export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("eyebrow flex items-center gap-3 text-accent", className)}>
      <span aria-hidden className="h-px w-8 bg-current opacity-60" />
      {children}
    </p>
  );
}

/**
 * Section header. `align="split"` puts the title and the supporting copy in
 * two columns with a rule between them, which is the layout that carries most
 * of the studio feel; `align="stacked"` is the narrow variant for short
 * sections.
 */
export function SectionHead({
  kicker,
  title,
  lede,
  actions,
  align = "split",
  className,
}: {
  kicker?: string;
  title: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
  align?: "split" | "stacked";
  className?: string;
}) {
  if (align === "stacked") {
    return (
      <div className={cn("max-w-2xl", className)}>
        {kicker ? <Kicker>{kicker}</Kicker> : null}
        <h2 className="mt-5 font-display display-3 text-text-1">{title}</h2>
        {lede ? <p className="mt-4 text-base leading-relaxed text-text-2">{lede}</p> : null}
        {actions ? <div className="mt-7 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-16", className)}>
      <div>
        {kicker ? <Kicker>{kicker}</Kicker> : null}
        <h2 className="mt-5 font-display display-2 text-text-1">{title}</h2>
      </div>
      {lede || actions ? (
        <div className="flex flex-col justify-end border-l border-edge-subtle pl-6 lg:pl-8">
          {lede ? <p className="text-base leading-relaxed text-text-2">{lede}</p> : null}
          {actions ? <div className="mt-6 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Page masthead. One component for every page below the home hero, in two
 * flavours: type-only, or type over a full-bleed image. Both share the same
 * baseline so headings land in the same place from page to page.
 */
export function Masthead({
  kicker,
  title,
  lede,
  actions,
  meta,
  image,
  alt,
  tone = "canvas",
}: {
  kicker: string;
  title: string;
  lede?: string;
  actions?: ReactNode;
  meta?: ReactNode;
  image?: string;
  alt?: string;
  tone?: Tone;
}) {
  return (
    <header
      className={cn(
        "relative overflow-hidden border-b border-edge-subtle",
        image ? "bg-canvas" : toneClass[tone],
        "pt-[calc(6rem+env(safe-area-inset-top))] pb-14 sm:pt-40 sm:pb-20",
      )}
    >
      {image ? (
        <div className="absolute inset-0">
          <Image src={image} alt={alt ?? ""} fill priority className="object-cover object-center" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/92 to-canvas/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-canvas via-transparent to-canvas/60" />
        </div>
      ) : null}

      <div className="container-wide relative z-10">
        <Kicker>{kicker}</Kicker>
        <h1 className="mt-6 max-w-[16ch] font-display display-1 text-text-1">{title}</h1>
        {lede ? (
          <p className="mt-7 max-w-xl text-base leading-relaxed text-text-2 sm:text-lg">{lede}</p>
        ) : null}
        {actions ? <div className="mt-9 flex flex-wrap gap-3">{actions}</div> : null}
        {meta ? <div className="mt-10 rule pt-5 text-sm text-text-3">{meta}</div> : null}
      </div>
    </header>
  );
}

/**
 * Numbered sequence. Rules and oversized ordinals rather than boxes — the
 * point is that these are steps in an order, which a row of equal cards
 * actively hides.
 */
export function Sequence({
  items,
  className,
}: {
  items: Array<{ title: string; body: ReactNode; meta?: string }>;
  className?: string;
}) {
  return (
    <ol className={cn("grid", className)}>
      {items.map((item, index) => (
        <li
          key={item.title}
          className="grid gap-4 rule py-8 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-10 sm:py-10 last:pb-0"
        >
          <span aria-hidden className="ordinal text-accent/50">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="max-w-2xl">
            <h3 className="font-display display-3 text-text-1">{item.title}</h3>
            <div className="mt-3 text-sm leading-relaxed text-text-2 sm:text-base">{item.body}</div>
            {item.meta ? <p className="mt-4 eyebrow text-text-3">{item.meta}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

/**
 * Editorial card. Optional href turns the whole card into one link target
 * rather than leaving a small "read more" as the only hit area.
 */
export function EditorialCard({
  href,
  kicker,
  title,
  body,
  meta,
  image,
  alt,
  className,
}: {
  href?: string;
  kicker?: string;
  title: string;
  body?: ReactNode;
  meta?: ReactNode;
  image?: string;
  alt?: string;
  className?: string;
}) {
  const inner = (
    <>
      {image ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-inset">
          <Image
            src={image}
            alt={alt ?? ""}
            fill
            className="object-cover transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.04]"
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
        </div>
      ) : null}
      <div className={cn("flex flex-1 flex-col p-6", !image && "pt-7")}>
        {kicker ? <p className="eyebrow text-accent">{kicker}</p> : null}
        <h3 className="mt-3 font-display text-xl text-text-1">{title}</h3>
        {body ? <div className="mt-3 text-sm leading-relaxed text-text-2">{body}</div> : null}
        {meta ? <div className="mt-5 rule pt-4 text-xs text-text-3">{meta}</div> : null}
        {href ? (
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent">
            Read more
            <ArrowRight className="h-4 w-4 transition-transform duration-[var(--dur-fast)] group-hover:translate-x-1" />
          </span>
        ) : null}
      </div>
    </>
  );

  const classes = cn(
    "group flex flex-col overflow-hidden border border-edge-subtle bg-raised",
    "transition-colors duration-[var(--dur-base)] ease-[var(--ease-out)]",
    href && "hover:border-edge-strong",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }
  return <article className={classes}>{inner}</article>;
}

/**
 * Bulleted list. Every content page on this site has three or four of these,
 * so the marker, spacing and colour live here rather than being re-typed —
 * that repetition was most of what made the old pages drift apart.
 */
export function Checklist({
  items,
  columns = 1,
  tone = "accent",
  className,
}: {
  items: readonly string[];
  columns?: 1 | 2;
  tone?: "accent" | "ai" | "muted";
  className?: string;
}) {
  const dot =
    tone === "ai" ? "bg-ai" : tone === "muted" ? "bg-text-3" : "bg-accent";
  return (
    <ul className={cn("grid gap-3", columns === 2 && "sm:grid-cols-2 sm:gap-x-8", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed text-text-2">
          <span aria-hidden className={cn("mt-2 h-1.5 w-1.5 shrink-0 rounded-full", dot)} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Divided grid of short definitions — the workhorse content block. */
export function DefinitionGrid({
  items,
  columns = 2,
  className,
}: {
  items: Array<{ title: string; body: ReactNode }>;
  columns?: 2 | 3;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-px overflow-hidden border border-edge-subtle bg-edge-subtle",
        columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2",
        className,
      )}
    >
      {items.map((item) => (
        <div key={item.title} className="bg-canvas p-7">
          <h3 className="font-display text-xl text-text-1">{item.title}</h3>
          <div className="mt-3 text-sm leading-relaxed text-text-2">{item.body}</div>
        </div>
      ))}
    </div>
  );
}

/** Figures on a rule, not in boxes. */
export function StatRow({
  stats,
  className,
}: {
  stats: Array<{ value: string; label: string }>;
  className?: string;
}) {
  return (
    <dl className={cn("grid gap-px overflow-hidden border border-edge-subtle bg-edge-subtle sm:grid-cols-2 lg:grid-cols-4", className)}>
      {stats.map((stat) => (
        <div key={stat.label} className="bg-canvas px-6 py-8">
          <dt className="eyebrow text-text-3">{stat.label}</dt>
          <dd className="tnum mt-3 font-display display-3 text-text-1">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Closing call to action. The one place a page is allowed to shout. */
export function CtaBand({
  kicker,
  title,
  lede,
  actions,
  tone = "blue",
}: {
  kicker?: string;
  title: string;
  lede?: string;
  actions: ReactNode;
  tone?: Tone;
}) {
  return (
    <Band tone={tone} size="lg" bordered={false}>
      <div className="max-w-3xl">
        {kicker ? <Kicker>{kicker}</Kicker> : null}
        <h2 className="mt-6 font-display display-2 text-text-1">{title}</h2>
        {lede ? <p className="mt-6 max-w-xl text-base leading-relaxed text-text-2 sm:text-lg">{lede}</p> : null}
        <div className="mt-9 flex flex-wrap gap-3">{actions}</div>
      </div>
    </Band>
  );
}

/**
 * Continuous marquee. Children are rendered twice so the -50% translate loops
 * without a visible seam; the copy is hidden from assistive tech.
 */
export function Marquee({
  children,
  duration = 40,
  className,
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
}) {
  return (
    <div className={cn("marquee overflow-hidden", className)}>
      <div className="marquee-track" style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Two-column prose + aside, the layout most content pages actually want. */
export function SplitBody({
  children,
  aside,
  className,
}: {
  children: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16", className)}>
      <div className="max-w-2xl space-y-5 text-base leading-relaxed text-text-2">{children}</div>
      {aside ? <aside className="lg:border-l lg:border-edge-subtle lg:pl-10">{aside}</aside> : null}
    </div>
  );
}

/** Empty state that still sells the next step. */
export function Placeholder({
  title,
  body,
  actions,
}: {
  title: string;
  body: string;
  actions?: ReactNode;
}) {
  return (
    <div className="border border-dashed border-edge bg-raised p-8 sm:p-12">
      <h3 className="font-display text-2xl text-text-1">{title}</h3>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-2">{body}</p>
      {actions ? <div className="mt-7 flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
