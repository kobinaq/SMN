import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Social Marketers Network.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let’s talk."
        description="Partnerships, speaking, general questions, or talent requests. Send a message."
      />
      <section className="border-t border-white/10 bg-ink pb-24">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm text-white/55">Email</p>
            <a href={`mailto:${site.email}`} className="mt-1 block text-lg text-white hover:text-baby-blue">
              {site.email}
            </a>
            <p className="mt-8 text-sm text-white/55">Community</p>
            <a
              href={site.discordInvite}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block text-lg text-white hover:text-baby-blue"
            >
              Join Discord
            </a>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-surface p-6 md:p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
