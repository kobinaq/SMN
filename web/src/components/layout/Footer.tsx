import Link from "next/link";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { agencyEnabled } from "@/lib/features";
import {
  footerAgencyLink,
  footerBrand,
  footerExplore,
  footerMore,
  footerPrograms,
  subscribeModule,
} from "@/lib/pages/chrome";
import type { SiteConfig } from "@/lib/site";

const tapLink =
  "inline-flex min-h-11 min-w-11 items-center text-sm text-text-2 transition hover:text-text-1";

const exploreLinks = agencyEnabled ? [...footerExplore, footerAgencyLink] : [...footerExplore];

export function Footer({ site }: { site: SiteConfig }) {
  return (
    <footer className="border-t border-edge-subtle bg-raised pb-[env(safe-area-inset-bottom)]">
      <div className="container-wide py-12 sm:py-16 md:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex min-h-11 items-center">
              <BrandLogo className="h-16 sm:h-20" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-text-2 sm:mt-5">{footerBrand}</p>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-3 sm:text-xs">
              Explore
            </p>
            <ul className="mt-3 space-y-1 sm:mt-4">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={tapLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-3 sm:text-xs">
              Programs
            </p>
            <ul className="mt-3 space-y-1 sm:mt-4">
              {footerPrograms.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={tapLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-3 sm:text-xs">
              More
            </p>
            <ul className="mt-3 space-y-1 sm:mt-4">
              {footerMore.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={tapLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 max-w-xl border-t border-edge-subtle pt-8 sm:mt-14">
          <h2 className="font-display text-2xl text-text-1">{subscribeModule.heading}</h2>
          <p className="mt-3 text-sm leading-relaxed text-text-2">{subscribeModule.body}</p>
          <NewsletterForm
            id="footer-newsletter-email"
            className="mt-5"
            buttonLabel={subscribeModule.button}
            successMessage={subscribeModule.success}
            privacy
          />
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-edge-subtle pt-6 text-xs text-text-3 sm:mt-14 sm:pt-8 sm:text-sm md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            <Link href="/privacy" className={`${tapLink} hover:text-text-2`}>
              Privacy
            </Link>
            <Link href="/terms" className={`${tapLink} hover:text-text-2`}>
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
