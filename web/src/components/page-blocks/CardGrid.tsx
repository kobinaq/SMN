import Link from "next/link";
import { Band } from "@/components/site/kit";
import { Picture, isExternal, safeHref } from "./helpers";
import type { LinkData, MediaRef } from "./types";

type Card = { meta?: string; title?: string; text?: string; audience?: string; image?: MediaRef; imagePreset?: string | null; link?: LinkData };
type Props = { heading?: string; intro?: string; variant?: "program-types" | "approaches" | "audiences"; cards?: Card[] };

const columns = {
  "program-types": "sm:grid-cols-2 lg:grid-cols-3",
  approaches: "sm:grid-cols-2",
  audiences: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

export function CardGridBlock({ heading, intro, variant = "program-types", cards }: Props) {
  if (!cards?.length) return null;
  return (
    <Band>
      {heading ? <h2 className="font-display display-3 text-text-1">{heading}</h2> : null}
      {intro ? <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-2">{intro}</p> : null}
      <ul className={`mt-8 grid gap-4 ${columns[variant] ?? columns["program-types"]}`}>
        {cards.map((card, i) => {
          const href = safeHref(card.link?.href);
          return (
            <li key={i} className="flex flex-col gap-3 rounded-2xl border border-edge-subtle bg-raised p-5">
              <Picture media={card.image} preset={card.imagePreset} className="aspect-[16/10]" />
              {card.meta ? <p className="eyebrow text-accent">{card.meta}</p> : null}
              <h3 className="font-display text-lg text-text-1">{card.title}</h3>
              {card.text ? <p className="text-sm leading-relaxed text-text-2">{card.text}</p> : null}
              {card.audience ? <p className="text-xs leading-relaxed text-text-3">{card.audience}</p> : null}
              {href && card.link?.label ? (
                <Link
                  href={href}
                  className="mt-auto inline-flex min-h-11 items-center text-sm font-semibold text-accent underline-offset-4 hover:underline"
                  {...(isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {card.link.label}
                </Link>
              ) : null}
            </li>
          );
        })}
      </ul>
    </Band>
  );
}
