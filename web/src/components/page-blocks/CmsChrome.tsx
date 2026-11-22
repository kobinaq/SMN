import Link from "next/link";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { filterBySections, type SectionToggles } from "@/lib/page-blocks/section-visibility";
import { LinkButton, isExternal, safeHref } from "./helpers";
import type { LinkData } from "./types";

type NavLink = { label?: string | null; href?: string | null };
export type HeaderData = { navItems?: NavLink[] | null; ctaButton?: LinkData; sections?: SectionToggles | null } | null;
export type FooterData = {
  blurb?: string | null;
  columns?: Array<{ heading?: string | null; links?: NavLink[] | null }> | null;
  legalLinks?: NavLink[] | null;
  socialLinks?: Array<{ platform?: string | null; url?: string | null }> | null;
} | null;

const tap = "inline-flex min-h-11 min-w-11 items-center text-sm text-text-2 hover:text-text-1";

function ChromeLink({ link, className = tap }: { link: NavLink; className?: string }) {
  const href = safeHref(link.href);
  if (!href || !link.label) return null;
  return (
    <Link href={href} className={className} {...(isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {link.label}
    </Link>
  );
}

/** CMS header. Honors the Agency and Events toggles (preview only until Phase 2E). */
export function CmsHeader({ header }: { header: HeaderData }) {
  const items = filterBySections(header?.navItems, header?.sections);
  const cta = header?.ctaButton && !filterBySections([header.ctaButton], header.sections).length ? null : header?.ctaButton;
  return (
    <header className="border-b border-edge-subtle bg-canvas">
      <div className="container-wide flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3">
        <Link href="/" className="inline-flex min-h-11 items-center">
          <BrandLogo className="h-10" />
        </Link>
        <nav aria-label="Main" className="flex flex-wrap items-center gap-x-4">
          {items.map((item, i) => (
            <ChromeLink key={i} link={item} />
          ))}
        </nav>
        <LinkButton link={cta} />
      </div>
    </header>
  );
}

export function CmsFooter({ footer, sections }: { footer: FooterData; sections?: SectionToggles | null }) {
  const columns = (footer?.columns ?? []).map((c) => ({ ...c, links: filterBySections(c.links, sections) }));
  const legal = filterBySections(footer?.legalLinks, sections);
  const social = (footer?.socialLinks ?? []).filter((s) => s.url && safeHref(s.url)?.startsWith("https://"));
  return (
    <footer className="border-t border-edge-subtle bg-raised">
      <div className="container-wide py-10 sm:py-14">
        {footer?.blurb ? <p className="max-w-sm text-sm leading-relaxed text-text-2">{footer.blurb}</p> : null}
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((column, i) => (
            <div key={i}>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-3">{column.heading}</p>
              <ul className="mt-3 space-y-1">
                {column.links.map((link, j) => (
                  <li key={j}>
                    <ChromeLink link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-x-5 border-t border-edge-subtle pt-4">
          {legal.map((link, i) => (
            <ChromeLink key={i} link={link} />
          ))}
          {social.map((s, i) => (
            <a key={i} href={s.url as string} target="_blank" rel="noopener noreferrer" className={`${tap} capitalize`}>
              {s.platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
