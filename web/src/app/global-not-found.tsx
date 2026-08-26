import Link from "next/link";
import { SiteDocument } from "@/components/layout/SiteDocument";
import { Button } from "@/components/ui/Button";
import { cta } from "@/lib/cta";

const quickLinks = [
  { href: "/programs", label: "Academy" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
];

export const metadata = {
  title: "Page not found · Social Marketers Network",
  description: "The page you are looking for does not exist.",
};

/**
 * 404 for URLs that match no route at all. `not-found.tsx` files still handle
 * notFound() inside a route group; this one exists because the app has several
 * root layouts, so there is no single layout to compose a global 404 from.
 * It must return a complete document, which SiteDocument supplies.
 */
export default function GlobalNotFound() {
  return (
    <SiteDocument>
      <main
        id="main"
        className="grain flex min-h-svh flex-col items-center justify-center px-6 py-24 text-center"
      >
        <p className="text-[11px] font-medium tracking-[0.28em] text-accent uppercase">
          Error 404
        </p>
        <h1 className="mt-4 font-display text-4xl text-text-1 sm:text-6xl">
          This page isn’t here
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-text-2 sm:text-base">
          The page you are looking for may have moved or never existed. Apply for the next cohort
          or head back home.
        </p>
        <div className="btn-row-mobile mt-8">
          <Button href={cta.applyCohort.href}>{cta.applyCohort.shortLabel}</Button>
          <Button href="/" variant="secondary">
            Back to home
          </Button>
        </div>
        <nav
          aria-label="Popular pages"
          className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-text-3"
        >
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-text-1">
              {link.label}
            </Link>
          ))}
        </nav>
      </main>
    </SiteDocument>
  );
}
