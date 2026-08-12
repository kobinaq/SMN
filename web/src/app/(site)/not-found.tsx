import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cta } from "@/lib/cta";
import { getEventCalendar, getNextEvent } from "@/lib/events";

const quickLinks = [
  { href: "/programs", label: "Academy" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
];

export default async function SiteNotFound() {
  const next = getNextEvent(await getEventCalendar().catch(() => []));

  return (
    <section className="container-page flex flex-col items-center justify-center py-28 text-center sm:py-36">
      <p className="text-[11px] font-medium tracking-[0.28em] text-baby-blue uppercase">
        Error 404
      </p>
      <h1 className="mt-4 font-display text-4xl text-white sm:text-6xl">This page isn’t here</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55 sm:text-base">
        The page you are looking for may have moved or never existed. Apply for the next cohort, or
        pick up from a live session.
      </p>
      <div className="btn-row-mobile mt-8">
        <Button href={cta.applyCohort.href}>{cta.applyCohort.shortLabel}</Button>
        {next ? (
          <Button href={`/events/${next.slug}`} variant="secondary">
            Register for next event
          </Button>
        ) : (
          <Button href="/" variant="secondary">
            Back to home
          </Button>
        )}
      </div>
      <nav
        aria-label="Popular pages"
        className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-white/45"
      >
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href} className="transition hover:text-white">
            {link.label}
          </Link>
        ))}
      </nav>
    </section>
  );
}
