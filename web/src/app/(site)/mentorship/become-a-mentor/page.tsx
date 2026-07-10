import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Become a Mentor",
  description: "Mentor marketers in the Network.",
};

export default function BecomeMentorPage() {
  return (
    <>
      <PageHero
        eyebrow="Give back"
        title="Become a mentor"
        description="If you have real experience, help marketers in the Network grow with clear, honest guidance."
      />
      <section className="border-t border-white/10 bg-ink pb-24">
        <div className="container-wide max-w-2xl rounded-[2rem] border border-white/10 bg-surface p-6 md:p-10">
          <ContactForm defaultType="Other" />
          <p className="mt-4 text-xs text-white/40">
            Use the message field to share expertise, years of experience, and LinkedIn.
          </p>
        </div>
      </section>
    </>
  );
}
