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
          <p className="rounded-2xl border border-amber-400/30 bg-amber-400/5 px-4 py-3 text-amber-100/90">
            <strong>Client / counsel confirmation required.</strong> This policy describes current
            product systems for transparency. It is not a final legal opinion and must be reviewed
            before relying on it as definitive public legal terms.
          </p>

          <div>
            <h2 className="font-display text-xl text-white">What we collect</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Application, contact, and newsletter form submissions</li>
              <li>Member account details (name, email, profile, career interests)</li>
              <li>LMS activity such as course progress and lesson completion</li>
              <li>Mentorship requests and opportunity-tracking activity</li>
              <li>Portfolio content members choose to publish</li>
              <li>Certificate records used for public verification</li>
              <li>
                Limited AI feature usage metadata when those features are enabled (prompts/answers
                are minimised; see AI disclosure)
              </li>
              <li>Basic analytics events for conversion and site improvement</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl text-white">How we use information</h2>
            <p className="mt-3">
              We use information to review applications, operate programmes, deliver learning,
              provide mentorship and opportunity tools, issue credentials, respond to enquiries, and
              improve the website. Transactional email may be sent via Resend. Newsletters may use
              Mailchimp. Self-paced course payments may be processed by Selar.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-white">Cookies and analytics</h2>
            <p className="mt-3">
              Essential cookies support sign-in and security. Privacy-conscious analytics may record
              events such as CTA clicks and application completion without collecting unnecessary
              sensitive fields.{" "}
              <em>[Client confirmation: analytics vendor and cookie banner requirements.]</em>
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-white">AI features</h2>
            <p className="mt-3">
              When AI Tutor or Career Coach are enabled for a member, SMN sends only the context
              needed for the request. Full prompts/answers are not retained as ordinary usage logs.
              AI output can be wrong and should be reviewed before acting.{" "}
              <em>[Client confirmation: public AI disclosure wording.]</em>
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl text-white">Your requests</h2>
            <p className="mt-3">
              Contact{" "}
              <a className="text-baby-blue hover:text-white" href={`mailto:${site.email}`}>
                {site.email}
              </a>{" "}
              to request access or deletion of personal data where applicable.{" "}
              <em>[Client confirmation: data-protection officer / regional obligations.]</em>
            </p>
          </div>

          <p>We do not sell personal data.</p>
        </div>
      </section>
    </>
  );
}
