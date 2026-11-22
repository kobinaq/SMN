import { Band } from "@/components/site/kit";
import { Picture, isExternal, safeHref } from "./helpers";
import type { MediaRef } from "./types";

type Partner = { name?: string; logo?: MediaRef; url?: string; approved?: boolean };

export function PartnerLogosBlock({ heading, partners }: { heading?: string; partners?: Partner[] }) {
  // Only approved logos are ever shown.
  const shown = (partners ?? []).filter((p) => p.approved === true && p.logo && typeof p.logo === "object" && p.logo.url);
  if (!shown.length) return null;
  return (
    <Band size="sm">
      {heading ? <h2 className="font-display text-xl text-text-1">{heading}</h2> : null}
      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {shown.map((p, i) => {
          const href = safeHref(p.url);
          const logo = <Picture media={p.logo} className="aspect-[3/2] bg-transparent" />;
          return (
            <li key={i} aria-label={p.name}>
              {href ? (
                <a
                  href={href}
                  className="block min-h-11"
                  {...(isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {logo}
                  <span className="sr-only">{p.name}</span>
                </a>
              ) : (
                logo
              )}
            </li>
          );
        })}
      </ul>
    </Band>
  );
}
