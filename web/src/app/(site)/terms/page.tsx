import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms and conditions",
  description: "Terms of use for the Social Marketers Network website and programmes.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms and conditions"
        description="Website, application, and programme terms at a high level."
      />
      <section className="border-t border-white/10 bg-ink pb-24">
        <div className="container-page max-w-3xl space-y-8 text-sm leading-relaxed text-white/65">
          <p className="rounded-2xl border border-amber-400/30 bg-amber-400/5 px-4 py-3 text-amber-100/90">
            <strong>Client / counsel confirmation required.</strong> These terms summarise product
            behaviour and intended policies. Confirm refunds, governing law, and payment terms
            before public launch.
          </p>

          <div>
            <h2 className="font-display text-xl text-white">Website use</h2>
            <p className="mt-3">
              Content on this site is for general information. Programme details, pricing, and dates
              may change. Self-paced course purchases on Selar are subject to Selar’s terms.
              Community participation on WhatsApp is subject to WhatsApp’s terms and SMN community
              guidelines.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-white">Applications and payment</h2>
            <p className="mt-3">
              Cohort applications are reviewed by SMN. Submitting an application does not create a
              payment obligation. Fees and payment plans are arranged after acceptance. Published
              fees are only shown when confirmed by SMN.{" "}
              <em>[Client confirmation: exact refund and cancellation policy.]</em>
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-white">Member platform</h2>
            <p className="mt-3">
              Accepted members may receive access to the member portal, LMS progress tools,
              mentorship requests, opportunity tracking, portfolios, and certificates. Access may be
              revoked for policy violations or non-payment after acceptance.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-white">No employment guarantee</h2>
            <p className="mt-3">
              SMN helps members prepare for marketing work and connect with opportunities. We do not
              guarantee employment, income, or specific career outcomes.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-white">Contact</h2>
            <p className="mt-3">
              Questions:{" "}
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
