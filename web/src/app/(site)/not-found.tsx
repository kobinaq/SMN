import Link from "next/link";
import { Button } from "@/components/ui/Button";

const quickLinks = [
  { href: "/programs", label: "Programmes" },
  { href: "/insights", label: "Insights" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
];

export default function SiteNotFound() {
  return (
    <section className="container-page flex flex-col items-center justify-center py-28 text-center sm:py-36">
      <p className="text-[11px] font-medium tracking-[0.28em] text-baby-blue uppercase">
        Error 404
      </p>
      <h1 className="mt-4 font-display text-4xl text-white sm:text-6xl">This page isn’t here</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55 sm:text-base">
        The page you’re looking for may have moved or never existed. Let’s get you back to
        something useful.
      </p>
      <div className="btn-row-mobile mt-8">
        <Button href="/">Back to home</Button>
        <Button href="/programs" variant="secondary">
          Explore programmes
        </Button>
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
