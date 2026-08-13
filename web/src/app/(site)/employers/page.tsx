import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { CinematicPageHero } from "@/components/layout/CinematicPageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { Button } from "@/components/ui/Button";
import { partnerTracks, seoTitle } from "@/lib/brand";
import { cta } from "@/lib/cta";
import { img } from "@/lib/images";

export const metadata: Metadata = {
  title: seoTitle("Partner With Us"),
  description:
    "Build with the next generation of marketers. Train teams, hire SMN talent, collaborate on events, or sponsor access to training and experience.",
  alternates: { canonical: "/employers" },
};

export default function EmployersPage() {
  const hireTrack = partnerTracks.find((track) => track.id === "hire")!;
  const otherTracks = partnerTracks.filter((track) => track.id !== "hire");

  return (
    <>
      <CinematicPageHero
        image={img.hireConversation}
        alt="Two marketers in conversation"
        kicker="Partner with us"
        title="Build with the next generation of marketers."
        description="Social Marketers Network works with brands, organisations, agencies, and industry professionals to create opportunities for learning, talent, collaboration, and career development."
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
            Four ways to work with the Network
          </h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.35fr_0.85fr] lg:gap-5">
            <Link
              href={hireTrack.href}
              className="group relative min-h-[22rem] overflow-hidden rounded-[1.75rem] border border-white/10 sm:min-h-[26rem] sm:rounded-[2rem]"
            >
              <Image
                src={img.eventPortfolio}
                alt="Two marketers in a working conversation"
                fill
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-near-black via-near-black/55 to-near-black/20" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-mint">
                  Track {hireTrack.n} · {hireTrack.kicker}
                </p>
                <h3 className="mt-3 font-display text-3xl text-white sm:text-4xl">{hireTrack.title}</h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/70">{hireTrack.body}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white transition group-hover:text-baby-blue">
                  {hireTrack.cta}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>

            <div className="grid gap-5">
              {otherTracks.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group flex flex-col justify-between rounded-[1.75rem] border border-white/10 bg-surface p-6 transition hover:border-baby-blue/35 sm:rounded-[2rem] sm:p-7"
                >
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-baby-blue">
                      Track {item.n} · {item.kicker}
                    </p>
                    <h3 className="mt-3 font-display text-2xl text-white group-hover:text-baby-blue">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/60">{item.body}</p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/85">
                    {item.cta}
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-near-black py-16 sm:py-24">
        <div className="container-wide space-y-16">
          {partnerTracks.map((track) => (
            <article
              key={track.id}
              id={track.id}
              className="grid gap-8 border-t border-white/10 pt-12 first:border-t-0 first:pt-0 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16"
            >
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-baby-blue">
                  Track {track.n}
                </p>
                <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">{track.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">{track.body}</p>
                <p className="mt-4 text-sm text-white/40">Best for: {track.bestFor}</p>
                <div className="btn-row-mobile mt-6">
                  {track.id === "hire" ? (
                    <>
                      <Button href="#employer-form">{cta.hireTalent.label}</Button>
                      <Button href={cta.requestIntern.href} variant="secondary">
                        {cta.requestIntern.label}
                      </Button>
                    </>
                  ) : (
                    <Button href={`/contact?type=${encodeURIComponent(track.formType)}#message`}>
                      {track.cta}
                    </Button>
                  )}
                </div>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {track.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-white/10 bg-surface px-4 py-4 text-sm text-white/70"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-ink py-16 sm:py-20">
        <div className="container-wide">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                title: "Proof of work",
                body: "Review public member profiles and case studies before you talk to anyone.",
              },
              {
                title: "SMN Experience",
                body: "Match emerging marketers to internships, volunteer roles, and project briefs.",
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
          <p className="mt-10 max-w-2xl text-sm text-white/45">
            Learn more about the{" "}
            <Link href="/experience" className="text-baby-blue transition hover:text-white">
              SMN Experience Programme
            </Link>{" "}
            or the{" "}
            <Link href="/community" className="text-baby-blue transition hover:text-white">
              Network
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="border-t border-white/10 bg-near-black py-16 sm:py-24">
        <div className="container-wide max-w-3xl">
          <h2 className="font-display text-3xl text-white sm:text-4xl">
            Have an idea we have not listed?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
            Partnerships do not always fit neatly into a category. If you have an idea for how your
            organisation could contribute to or benefit from the Social Marketers Network, let us
            explore it together.
          </p>
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
