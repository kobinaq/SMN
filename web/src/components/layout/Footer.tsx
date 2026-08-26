import Link from "next/link";
import { BrandLogo } from "@/components/layout/BrandLogo";
import type { SiteConfig } from "@/lib/site";

const footerLinks = [
  {
    title: "Academy",
    links: [
      { label: "Flagship cohort", href: "/programs/cohort" },
      { label: "Courses", href: "/programs/courses" },
      { label: "Simulations", href: "/experience#simulations" },
      { label: "Experience", href: "/experience" },
      { label: "Apply", href: "/apply" },
    ],
  },
  {
    title: "Network",
    links: [
      { label: "Jobs", href: "/careers/jobs" },
      { label: "Community", href: "/community" },
      { label: "Events", href: "/events" },
      { label: "About", href: "/about" },
      { label: "Partner with us", href: "/employers" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Footer({ site }: { site: SiteConfig }) {
  return (
    <footer className="border-t border-edge-subtle bg-raised pb-[env(safe-area-inset-bottom)]">
      <div className="container-wide py-12 sm:py-16 md:py-20">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr] md:gap-12">
          <div className="sm:col-span-2 md:col-span-1">
            <BrandLogo className="h-8 sm:h-9" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-text-2 sm:mt-5">
              {site.tagline}
            </p>
            <p className="mt-4 text-xs leading-relaxed text-text-3 sm:mt-6 sm:text-sm">
              {site.footerBlurb}
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-3 sm:text-xs">
                {group.title}
              </p>
              <ul className="mt-3 space-y-1 sm:mt-4 sm:space-y-3">
                {group.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-10 items-center text-sm text-text-2 transition hover:text-text-1 sm:min-h-0"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-edge-subtle pt-6 text-xs text-text-3 sm:mt-14 sm:pt-8 sm:text-sm md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="hover:text-text-2">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-text-2">
              Terms
            </Link>
            <a
              href={site.social.instagram}
              className="hover:text-text-2"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a
              href={site.social.linkedin}
              className="hover:text-text-2"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
