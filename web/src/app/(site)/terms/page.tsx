import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms and conditions",
  description: "Terms of use for the Social Marketers Network website and programmes.",
  alternates: { canonical: "/terms" },
};

const sections = [
  {
    id: "website",
    title: "Website use",
    body: (
      <p className="mt-4">
        Content on this site is for general information. Programme details, pricing, and dates may
        change. Self-paced course and event payments are processed by Paystack and subject to
        Paystack’s terms. Community participation on WhatsApp is subject to WhatsApp’s terms and SMN
        community guidelines.
      </p>
    ),
  },
  {
    id: "applications",
    title: "Applications and payment",
    body: (
      <p className="mt-4">
        Cohort applications are reviewed by SMN. Submitting an application does not create a payment
        obligation. Fees and payment plans are arranged after acceptance. Contact SMN for current
        fees and refund details.
      </p>
    ),
  },
  {
    id: "platform",
    title: "Member platform",
    body: (
      <p className="mt-4">
        Accepted members may receive access to the member portal, learning progress tools,
        mentorship requests, opportunity tracking, portfolios, and certificates. Access may be
        revoked for policy violations or non-payment after acceptance.
      </p>
    ),
  },
  {
    id: "employment",
    title: "No employment guarantee",
    body: (
      <p className="mt-4">
        SMN helps members prepare for marketing work and connect with opportunities. We do not
        guarantee employment, income, or specific career outcomes.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p className="mt-4">
        Questions:{" "}
        <a className="text-baby-blue transition hover:text-white" href={`mailto:${site.email}`}>
          {site.email}
        </a>
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10 bg-near-black pt-[calc(5.5rem+env(safe-area-inset-top))] sm:pt-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 85% 15%, rgba(126,182,255,0.1), transparent 50%), radial-gradient(ellipse 45% 35% at 10% 75%, rgba(127,216,190,0.07), transparent 45%)",
          }}
        />
        <div className="container-wide relative z-10 pb-14 pt-10 sm:pb-20 sm:pt-16">
          <p className="font-display text-sm tracking-[0.08em] text-baby-blue sm:text-base">
            Social Marketers Network
          </p>
          <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">Legal</p>
          <h1 className="mt-3 max-w-3xl text-balance font-display text-[2.35rem] leading-[1.05] text-white sm:text-5xl md:text-6xl">
            Terms and conditions
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
            Website, application, and programme terms at a high level.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/privacy" className="text-white/50 transition hover:text-baby-blue">
              Privacy policy
            </Link>
            <Link href="/contact" className="text-white/50 transition hover:text-baby-blue">
              Contact
            </Link>
          </div>
        </div>
      </section>

      <section data-section-fade className="bg-ink py-16 sm:py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <nav className="hidden lg:block" aria-label="Terms sections">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">On this page</p>
            <ul className="mt-4 sticky top-28 space-y-2 border-l border-white/10 pl-4">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block text-sm text-white/45 transition hover:text-baby-blue"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mx-auto w-full max-w-3xl space-y-0 lg:mx-0">
            {sections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-28 border-b border-white/10 py-10 first:pt-0 last:border-b-0"
              >
                <h2 className="font-display text-2xl text-white sm:text-3xl">{section.title}</h2>
                <div className="text-sm leading-relaxed text-white/65 sm:text-[15px]">{section.body}</div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
