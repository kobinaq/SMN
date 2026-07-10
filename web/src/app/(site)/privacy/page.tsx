import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy policy" description="How we handle information you share with us." />
      <section className="border-t border-white/10 bg-ink pb-24">
        <div className="container-page max-w-3xl space-y-4 text-sm leading-relaxed text-white/65">
          <p>
            We collect information you submit through forms (applications, contact, newsletter) to
            respond to enquiries and operate programs. Transactional emails may be sent via Resend.
            Newsletters are managed via Mailchimp. Payments for self-paced courses are processed by
            Selar.
          </p>
          <p>
            We do not sell personal data. Contact us to request access or deletion of form
            submissions where applicable.
          </p>
          <p>This is a starter policy and should be reviewed by counsel before public launch.</p>
        </div>
      </section>
    </>
  );
}
