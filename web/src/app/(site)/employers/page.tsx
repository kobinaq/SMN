import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { CinematicPageHero } from "@/components/layout/CinematicPageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { Button } from "@/components/ui/Button";
import { cta } from "@/lib/cta";
import { img } from "@/lib/images";

export const metadata: Metadata = {
  title: "Hire Talent",
  description:
    "Hire SMN talent, review portfolios, verify credentials, share opportunities, and partner with Social Marketers Network.",
  alternates: { canonical: "/employers" },
};

const featuredHire = {
  href: "#employer-form",
  label: "Hire or partner",
  title: "Start a hire enquiry",
  body: "Tell us the role, the skills, and the timeline. This is an employer enquiry, not a member application.",
  image: img.eventPortfolio,
  alt: "Two marketers in a working conversation",
};

const otherActions = [
  {
    href: cta.postJob.href,
    label: cta.postJob.label,
    title: "Post a marketing role",
    body: "Share a full-time, contract, freelance, or project brief. Staff review listings before they go public.",
  },
  {
    href: cta.requestIntern.href,
    label: cta.requestIntern.label,
    title: "Request an intern",
    body: "Scoped support for content, social, research, or campaigns, with a clear point of contact.",
  },
];

export default function EmployersPage() {
  return (
    <>
      <CinematicPageHero
        image={img.hireConversation}
        alt="Two marketers in conversation"
        kicker="Employers"
        title="Hire SMN talent and shape the next generation of marketers."
        description="SMN develops marketers with practical skills and proof of work. Use this page to hire or partner, not to apply to a cohort."
        actions={
          <>
            <Button href="#employer-form">{cta.hireTalent.label}</Button>
            <Button href={cta.postJob.href} variant="secondary">
              {cta.postJob.label}
            </Button>
          </>
        }
      />

      <section className="border-b border-white/10 bg-ink py-16 sm:py-24">
        <div className="container-wide">
          <h2 className="max-w-2xl font-display text-3xl text-white sm:text-4xl">
            Three ways to work with the Network
          </h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.35fr_0.85fr] lg:gap-5">
            <Link
              href={featuredHire.href}
              className="group relative min-h-[22rem] overflow-hidden rounded-[1.75rem] border border-white/10 sm:min-h-[26rem] sm:rounded-[2rem]"
            >
              <Image
                src={featuredHire.image}
                alt={featuredHire.alt}
                fill
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-near-black via-near-black/55 to-near-black/20" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-mint">
                  {featuredHire.label}
                </p>
                <h3 className="mt-3 font-display text-3xl text-white sm:text-4xl">{featuredHire.title}</h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/70">{featuredHire.body}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white transition group-hover:text-baby-blue">
                  Start an enquiry
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>

            <div className="grid gap-5">
              {otherActions.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex flex-col justify-between rounded-[1.75rem] border border-white/10 bg-surface p-6 transition hover:border-baby-blue/35 sm:rounded-[2rem] sm:p-7"
                >
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-baby-blue">
                      {item.label}
                    </p>
                    <h3 className="mt-3 font-display text-2xl text-white group-hover:text-baby-blue">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/60">{item.body}</p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/85">
                    Continue
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-near-black py-16 sm:py-20">
        <div className="container-wide grid gap-8 sm:grid-cols-3">
          {[
            {
              title: "Proof of work",
              body: "Review public member profiles and case studies before you talk to anyone.",
            },
            {
              title: "Verifiable credentials",
              body: "Certificates carry a public code employers can check on SMN.",
            },
            {
              title: "Staff-reviewed listings",
              body: "Roles and intern requests are read by SMN before they reach members.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="font-display text-xl text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="employer-form" className="scroll-mt-24 border-t border-white/10 bg-ink py-16 sm:py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="font-display text-3xl text-white sm:text-4xl">Hire or partner request</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/55 sm:text-base">
              Tell us what you need. This is an employer enquiry, not a member application.
            </p>
            <p className="mt-4 text-sm text-white/40">
              We do not guarantee employment outcomes. We help members prepare for work and make it
              easier for brands to meet strong marketing talent.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-surface p-6 sm:rounded-[2rem] sm:p-8 md:p-10">
            <ContactForm defaultType="Talent request" />
          </div>
        </div>
      </section>
    </>
  );
}
