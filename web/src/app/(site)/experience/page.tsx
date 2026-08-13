import type { Metadata } from "next";
import Image from "next/image";
import { CinematicPageHero } from "@/components/layout/CinematicPageHero";
import { Button } from "@/components/ui/Button";
import { experienceDeliverables, experienceReview, seoTitle } from "@/lib/brand";
import { cta } from "@/lib/cta";
import { img } from "@/lib/images";

export const metadata: Metadata = {
  title: seoTitle("SMN Experience Programme"),
  description:
    "After Social Media Marketing and AI training, selected SMN participants are matched with brands, agencies, and marketers for internships, projects, and portfolio-building experience.",
  alternates: { canonical: "/experience" },
};

const partnerProvides = [
  "Practical exposure to marketing work",
  "Guidance and professional mentorship",
  "A real or simulated brief or project",
  "Opportunities to contribute to appropriate tasks",
  "Feedback on the participant's work",
  "Insight into how marketing works in a professional environment",
];

const participantDoes = [
  "Be professional and reliable",
  "Attend agreed sessions or work hours",
  "Complete assigned tasks",
  "Ask questions and take initiative",
  "Apply their training to real situations",
  "Respect confidentiality",
  "Document their learning and work for their portfolio",
];

const participantLearns = [
  "Understanding a marketing brief",
  "Audience research",
  "Content strategy",
  "Campaign planning",
  "Social media management",
  "Content creation",
  "Community management",
  "PR and communications",
  "Marketing analytics",
  "Reporting",
  "Client and stakeholder communication",
  "Professional workflows",
  "Strategic decision-making",
];

const leavesWith = [
  {
    title: "Practical experience",
    body: "Evidence that they have worked on marketing problems beyond a classroom exercise.",
  },
  {
    title: "Portfolio projects",
    body: "Tangible work they can present to potential employers or clients.",
  },
  {
    title: "Professional feedback",
    body: "An assessment or recommendation from someone working in the industry.",
  },
  {
    title: "Industry exposure",
    body: "A better understanding of how marketing teams, agencies, or brands operate.",
  },
  {
    title: "Professional connections",
    body: "Relationships with experienced marketers and potential employers.",
  },
];

const partnerGains = [
  "Develop emerging marketing talent",
  "Give back to the marketing community",
  "Access potential interns or future employees",
  "Receive additional support on defined projects",
  "Build relationships with emerging marketers",
  "Contribute to closing the gap between marketing education and employment",
];

export default function ExperiencePage() {
  return (
    <>
      <CinematicPageHero
        image={img.internPath}
        alt="Two emerging marketers talking in the lounge"
        kicker="SMN Experience Programme"
        title="From training into real marketing work."
        description="After completing SMN's Social Media Marketing and AI Training Programme, selected participants are matched with marketing professionals, agencies, brands, and organisations based on skills, interests, and career direction."
        actions={
          <>
            <Button href={cta.applyCohort.href}>{cta.applyCohort.shortLabel}</Button>
            <Button href={cta.partner.href} variant="secondary">
              {cta.partner.label}
            </Button>
          </>
        }
      />

      <section className="border-b border-white/10 bg-ink py-16 sm:py-24">
        <div className="container-wide max-w-3xl">
          <h2 className="font-display text-3xl text-white sm:text-4xl md:text-5xl">
            Learn. Apply. Build experience. Start your career with the community.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-white/65 sm:text-base">
            The SMN Experience Programme helps participants transition from marketing education
            into practical professional experience. The engagement may take the form of an
            internship, volunteering, mentorship, project-based experience, or job shadowing. SMN
            remains involved throughout.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/45">
            Placements are not guaranteed. Eligible participants from the training programme are
            considered based on fit, readiness, and partner availability.
          </p>
        </div>
      </section>

      <section className="border-b border-white/10 bg-near-black py-16 sm:py-24">
        <div className="container-wide grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-[2rem]">
            <Image
              src={img.hireConversation}
              alt="A partner conversation about marketing work"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="image-matte" />
          </div>
          <div>
            <h2 className="font-display text-3xl text-white sm:text-4xl">What the partner provides</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/55">
              Depending on the agreed format, mentors and partners may provide:
            </p>
            <ul className="mt-6 space-y-3">
              {partnerProvides.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-white/70">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-baby-blue" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-ink py-16 sm:py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-3xl text-white sm:text-4xl">
              What the participant is expected to do
            </h2>
            <ul className="mt-6 space-y-3">
              {participantDoes.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-white/70">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl text-white sm:text-4xl">
              What the participant should learn
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/55">
              The experience should expose participants to how marketing works beyond the classroom.
              Depending on the placement, this may include:
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {participantLearns.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-white/70">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/25" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-near-black py-16 sm:py-24">
        <div className="container-wide">
          <h2 className="max-w-3xl font-display text-3xl text-white sm:text-4xl md:text-5xl">
            Leave with evidence, not only notes.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
            The key objective is tangible experience for a portfolio. Depending on the placement,
            participants should aim to complete three to five of the following.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {experienceDeliverables.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.75rem] border border-white/10 bg-surface p-6 sm:p-8"
              >
                <h3 className="font-display text-xl text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-ink py-16 sm:py-24">
        <div className="container-wide grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-3xl text-white sm:text-4xl">
              What the participant leaves with
            </h2>
            <div className="mt-8 space-y-6">
              {leavesWith.map((item) => (
                <div key={item.title}>
                  <h3 className="font-display text-xl text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-[2rem] lg:aspect-[5/4]">
            <Image
              src={img.practicePair}
              alt="Two marketers working through a brief"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="image-matte" />
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-near-black py-16 sm:py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-3xl text-white sm:text-4xl">What the partner gains</h2>
            <ul className="mt-6 space-y-3">
              {partnerGains.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-white/70">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-baby-blue" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl text-white sm:text-4xl">At the end of the experience</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
              SMN will conduct a simple Experience Review with both the participant and partner.
            </p>
            <ul className="mt-6 space-y-3">
              {experienceReview.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-white/70">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-ink py-16 sm:py-20">
        <div className="container-wide overflow-hidden rounded-2xl border border-white/10 bg-deep-blue p-6 sm:rounded-[2rem] sm:p-10 md:p-14">
          <h2 className="max-w-3xl font-display text-2xl text-white sm:text-3xl md:text-4xl">
            I did not just take a marketing course. I have actually worked through a marketing
            problem, applied what I learned, received professional feedback, and can show evidence
            of what I can do.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
            That is the shared outcome. Applied learning, professional feedback, and evidence of
            what you can do. Learn social media marketing. Lead with AI. Grow with a community.
            Leave with real-world experience.
          </p>
          <div className="btn-row-mobile mt-8">
            <Button href={cta.applyCohort.href} variant="light">
              {cta.applyCohort.label}
            </Button>
            <Button href={cta.partner.href} variant="secondary">
              {cta.partner.label}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
