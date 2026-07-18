import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Social Marketers Network handles personal information.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    id: "collect",
    title: "What we collect",
    body: (
      <ul className="mt-4 list-disc space-y-2 pl-5">
        <li>Application, contact, and newsletter form submissions</li>
        <li>Member account details (name, email, profile, career interests)</li>
        <li>Learning activity such as course progress and lesson completion</li>
        <li>Mentorship requests and opportunity-tracking activity</li>
        <li>Portfolio content members choose to publish</li>
        <li>Certificate records used for public verification</li>
        <li>Limited usage data when optional AI learning tools are enabled</li>
        <li>Basic analytics events for conversion and site improvement</li>
      </ul>
    ),
  },
  {
    id: "use",
    title: "How we use information",
    body: (
      <p className="mt-4">
        We use information to review applications, operate programmes, deliver learning, provide
        mentorship and opportunity tools, issue credentials, respond to enquiries, and improve the
        website. Transactional email may be sent via Resend. Newsletters may use Mailchimp. Course
        and event payments are processed by Paystack.
      </p>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and analytics",
    body: (
      <p className="mt-4">
        Essential cookies support sign-in and security. Analytics may record events such as CTA
        clicks and application completion without collecting unnecessary sensitive fields.
      </p>
    ),
  },
  {
    id: "ai",
    title: "AI features",
    body: (
      <p className="mt-4">
        When optional AI learning tools are enabled for a member, SMN sends only the context needed
        for the request. AI output can be wrong and should be reviewed before acting.
      </p>
    ),
  },
  {
    id: "requests",
    title: "Your requests",
    body: (
      <p className="mt-4">
        Contact{" "}
        <a className="text-baby-blue transition hover:text-white" href={`mailto:${site.email}`}>
          {site.email}
        </a>{" "}
        to request access or deletion of personal data where applicable.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10 bg-near-black pt-[calc(5.5rem+env(safe-area-inset-top))] sm:pt-28">
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 15% 20%, rgba(126,182,255,0.12), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 80%, rgba(127,216,190,0.08), transparent 50%)",
          }}
        />
        <div className="container-wide relative z-10 pb-14 pt-10 sm:pb-20 sm:pt-16">
          <p className="font-display text-sm tracking-[0.08em] text-baby-blue sm:text-base">
            Social Marketers Network
          </p>
          <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">Legal</p>
          <h1 className="mt-3 max-w-3xl text-balance font-display text-[2.35rem] leading-[1.05] text-white sm:text-5xl md:text-6xl">
            Privacy policy
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
            How we handle information you share across the website, applications, and member
            platform.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/terms" className="text-white/50 transition hover:text-baby-blue">
              Terms and conditions
            </Link>
            <Link href="/contact" className="text-white/50 transition hover:text-baby-blue">
              Contact
            </Link>
          </div>
        </div>
      </section>

      <section data-section-fade className="bg-ink py-16 sm:py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <nav className="hidden lg:block" aria-label="Privacy sections">
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
            <p className="pt-2 text-sm font-medium text-white/80">We do not sell personal data.</p>
            <p className="mt-8 text-xs text-white/35">
              Questions about this policy:{" "}
              <a className="text-baby-blue hover:text-white" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
