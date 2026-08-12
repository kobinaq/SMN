import type { Metadata } from "next";
import Image from "next/image";
import { CinematicPageHero } from "@/components/layout/CinematicPageHero";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { instructor } from "@/lib/content";
import { img } from "@/lib/images";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `Mission, story, and instructor behind ${site.name}.`,
  alternates: { canonical: "/about" },
};

const forWho = [
  "Beginners who want strategy, not a new posting trick every week",
  "Social media managers ready to think past the content calendar",
  "Freelancers who need proof of how they think, not only pretty work",
  "Marketers and owners who want AI with judgment still in the room",
];

const notFor = [
  "Anyone expecting a guaranteed job or income at the end",
  "People who want theory with no practice or feedback",
  "Employers looking to hire. That path is Hire Talent, not this page",
];

export default function AboutPage() {
  return (
    <>
      <CinematicPageHero
        image={img.aboutMission}
        alt="Lead instructor presenting to marketers"
        kicker="About"
        title="A place where marketers do not have to figure it out alone."
        description="Social Marketers Network started in Ghana as an academy and community for people who want strategy, practice, and a network that lasts after a course ends."
        actions={
          <>
            <Button href="/apply">Apply for the next cohort</Button>
            <Button href="/contact" variant="secondary">
              Contact us
            </Button>
          </>
        }
      />

      <section className="border-b border-white/10 bg-ink py-16 sm:py-24">
        <div className="container-wide grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal>
            <p className="font-display text-sm tracking-[0.08em] text-baby-blue">How we started</p>
            <h2 className="mt-4 font-display text-3xl text-white sm:text-4xl md:text-5xl">
              Built for marketers who are tired of learning in isolation.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-white/65 sm:text-base">
              Arielle Adodo founded SMN to help beginners, social media managers, and marketing
              professionals move past random posting. The work is strategy, AI used with care, and
              real practice with other people in the room.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">
              Today that means live training, a member platform, WhatsApp community, and a path
              toward portfolios, credentials, and introductions. The aim is simple: be a home for
              modern marketers across Africa and beyond.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-[2rem] lg:aspect-[5/4]">
              <Image
                src={img.instructorTeaching}
                alt="Arielle Adodo teaching a marketing session"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="image-matte" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-near-black py-16 sm:py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-3xl text-white sm:text-4xl">Who thrives here</h2>
            <ul className="mt-6 space-y-4">
              {forWho.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/70 sm:text-base">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-baby-blue" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl text-white sm:text-4xl">Who should go elsewhere</h2>
            <ul className="mt-6 space-y-4">
              {notFor.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/70 sm:text-base">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-white/25" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-white/45">
              Hiring or partnering?{" "}
              <a href="/employers" className="text-baby-blue transition hover:text-white">
                Hire SMN talent
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-ink py-16 sm:py-24">
        <div className="container-wide grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-[2rem]">
            <Image
              src={instructor.image}
              alt={instructor.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="image-matte" />
          </div>
          <div>
            <p className="font-display text-sm tracking-[0.08em] text-baby-blue">Lead instructor</p>
            <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl md:text-5xl">
              {instructor.name}
            </h2>
            <p className="mt-2 text-sm text-white/45">{instructor.role}</p>
            <p className="mt-5 text-sm leading-relaxed text-white/65 sm:text-base">
              {instructor.bio}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">
              {instructor.philosophy}
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/70">
              {instructor.highlights.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-baby-blue" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="btn-row-mobile mt-8">
              <Button href={instructor.linkedin} target="_blank" rel="noreferrer">
                View LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
