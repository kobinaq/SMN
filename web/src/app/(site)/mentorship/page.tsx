import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Mentorship",
  description: "Community-powered mentorship for modern marketers.",
};

export default function MentorshipPage() {
  return (
    <>
      <PageHero
        eyebrow="Mentorship"
        title="Guidance from people who’ve done the work."
        description="Get guidance from brand marketers, agency people, consultants, founders, and alumni."
      />
      <section className="border-t border-white/10 bg-ink py-20">
        <div className="container-wide grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-white">How it works</h2>
            <ul className="mt-6 space-y-3 text-white/70">
              <li>· One-on-one and group mentoring</li>
              <li>· Career guidance and portfolio reviews</li>
              <li>· CV and LinkedIn reviews</li>
              <li>· Office hours and industry Q&A</li>
            </ul>
            <p className="mt-6 text-sm text-white/45">
              A full mentor directory is planned for later. For now, apply to mentor or request
              guidance through the form.
            </p>
            <div className="mt-8">
              <Button href="/mentorship/become-a-mentor" variant="secondary">
                Become a mentor
              </Button>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-surface p-6 md:p-8">
            <h3 className="font-display text-2xl text-white">Request mentorship</h3>
            <p className="mt-2 text-sm text-white/50">Tell us what you need. We’ll follow up by email.</p>
            <div className="mt-6">
              <ContactForm defaultType="Other" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
