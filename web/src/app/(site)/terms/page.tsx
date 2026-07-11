import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of use" description="Guidelines for using this website." />
      <section className="border-t border-white/10 bg-ink pb-24">
        <div className="container-page max-w-3xl space-y-4 text-sm leading-relaxed text-white/65">
          <p>
            Content on this site is for general information. Program details, pricing, and dates may
            change. Course purchases on Selar are subject to Selar’s terms. Community participation
            on WhatsApp is subject to WhatsApp’s terms and SMN community guidelines.
          </p>
          <p>
            Employment is not guaranteed through any SMN program or partnership.
          </p>
          <p>This is a starter policy and should be reviewed by counsel before public launch.</p>
        </div>
      </section>
    </>
  );
}
