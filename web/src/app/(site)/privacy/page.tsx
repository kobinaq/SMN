import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Social Marketers Network handles personal information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy policy"
        description="How we handle information you share with us across the website, applications, and member platform."
      />
      <section className="border-t border-white/10 bg-ink pb-24">
        <div className="container-page max-w-3xl space-y-8 text-sm leading-relaxed text-white/65">
          <div>
            <h2 className="font-display text-xl text-white">What we collect</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Application, contact, and newsletter form submissions</li>
              <li>Member account details (name, email, profile, career interests)</li>
              <li>Learning activity such as course progress and lesson completion</li>
              <li>Mentorship requests and opportunity-tracking activity</li>
              <li>Portfolio content members choose to publish</li>
              <li>Certificate records used for public verification</li>
              <li>Limited usage data when optional AI learning tools are enabled</li>
              <li>Basic analytics events for conversion and site improvement</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl text-white">How we use information</h2>
            <p className="mt-3">
              We use information to review applications, operate programmes, deliver learning,
              provide mentorship and opportunity tools, issue credentials, respond to enquiries, and
              improve the website. Transactional email may be sent via Resend. Newsletters may use
              Mailchimp. Course and event payments are processed by Paystack.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-white">Cookies and analytics</h2>
            <p className="mt-3">
              Essential cookies support sign-in and security. Analytics may record events such as
              CTA clicks and application completion without collecting unnecessary sensitive fields.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-white">AI features</h2>
            <p className="mt-3">
              When optional AI learning tools are enabled for a member, SMN sends only the context
              needed for the request. AI output can be wrong and should be reviewed before acting.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-white">Your requests</h2>
            <p className="mt-3">
              Contact{" "}
              <a className="text-baby-blue hover:text-white" href={`mailto:${site.email}`}>
                {site.email}
              </a>{" "}
              to request access or deletion of personal data where applicable.
            </p>
          </div>

          <p>We do not sell personal data.</p>
        </div>
      </section>
    </>
  );
}
