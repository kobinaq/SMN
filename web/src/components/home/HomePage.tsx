import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HomeStory } from "@/components/motion/HomeStory";
import { Reveal } from "@/components/motion/Reveal";
import { HeroPhotoGallery } from "@/components/home/HeroPhotoGallery";
import { CohortSpotlight } from "@/components/home/CohortSpotlight";
import { GooeyText } from "@/components/motion/GooeyText";
import {
  beliefs,
  courses,
  ecosystem,
  events,
  instructor,
  stories,
} from "@/lib/content";
import { site } from "@/lib/site";

const ecosystemMorph = ["Learn", "Practice", "Connect", "Grow"];

export function HomePage() {
  return (
    <HomeStory>
      <HeroPhotoGallery />

      {/* PHILOSOPHY */}
      <section
        data-pin-chapter
        data-section-fade
        className="relative overflow-hidden bg-ink py-16 sm:py-24 md:py-36"
      >
        <div className="container-wide grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-14">
          <div>
            <div data-rule className="mb-6 h-px w-24 bg-baby-blue/60 sm:mb-8" />
            <p data-line className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue sm:text-xs">
              Our philosophy
            </p>
            <h2
              data-line
              className="mt-3 font-display text-2xl leading-tight text-white sm:mt-4 sm:text-3xl md:text-5xl"
            >
              We develop marketers, not content creators.
            </h2>
            <p data-line className="mt-4 text-base leading-relaxed text-white/65 sm:mt-6 sm:text-lg">
              Businesses hire marketers to understand audiences, solve problems, communicate
              clearly, use AI wisely, and show results.
            </p>
            <p data-line className="mt-3 text-base leading-relaxed text-white/65 sm:mt-4 sm:text-lg">
              Learning doesn’t stop when a course ends. It continues in the Network.
            </p>
          </div>
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:aspect-[4/5] sm:rounded-[2rem] md:aspect-[5/4]"
            data-parallax-wrap
          >
            <Image
              src="/images/workshop.jpg"
              alt="Instructor leading a marketing workshop"
              fill
              className="object-cover"
              data-parallax
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="image-matte" />
          </div>
        </div>
      </section>

      {/* BELIEFS */}
      <section data-section-fade className="border-y border-white/10 bg-surface py-16 sm:py-24 md:py-32">
        <div className="container-wide">
          <SectionHeading
            eyebrow="Core beliefs"
            title="What we stand for"
            description="A clear point of view on modern marketing careers."
          />
          <div data-stagger className="mt-8 grid gap-3 sm:mt-14 sm:gap-4 md:grid-cols-3">
            {beliefs.map((item, i) => (
              <div
                key={item.title}
                data-stagger-item
                className="rounded-2xl border border-white/10 bg-surface-2 p-5 transition duration-300 hover:border-baby-blue/30 sm:rounded-3xl sm:p-6 md:p-8"
              >
                <span className="font-display text-sm text-baby-blue">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-xl text-white md:text-2xl">{item.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-white/70">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEAD INSTRUCTOR */}
      <section data-section-fade className="bg-ink py-16 sm:py-24 md:py-32">
        <div className="container-wide grid items-center gap-8 sm:gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <Reveal>
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-[2rem]"
              data-parallax-wrap
            >
              <Image
                src={instructor.image}
                alt={instructor.name}
                fill
                className="object-cover"
                data-parallax
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="image-matte" />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue sm:text-xs">
              Lead instructor
            </p>
            <h2 className="mt-3 font-display text-2xl leading-tight text-white sm:mt-4 sm:text-3xl md:text-5xl">
              {instructor.name}
            </h2>
            <p className="mt-2 text-sm text-white/45 sm:text-base">{instructor.role}</p>
            <p className="mt-5 text-sm leading-relaxed text-white/70 sm:mt-6 sm:text-base">
              {instructor.bio}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
              {instructor.philosophy}
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/70 sm:mt-8">
              {instructor.highlights.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-baby-blue" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="btn-row-mobile mt-8 sm:mt-10">
              <Button href={instructor.linkedin} target="_blank" rel="noreferrer">
                View LinkedIn
              </Button>
              <Button href="/apply" variant="secondary">
                Apply to cohort
              </Button>
            </div>
            {instructor.note ? (
              <p className="mt-5 text-xs text-white/35">{instructor.note}</p>
            ) : null}
          </Reveal>
        </div>
      </section>
      <section data-section-fade className="bg-near-black py-16 sm:py-24 md:py-36">
        <div className="container-wide">
          <div data-rule className="mb-8 h-px w-full bg-white/10 sm:mb-10" />
          <SectionHeading
            eyebrow="How it works"
            title="One network. Multiple ways to grow."
            description="Classes, practice, community, and career support, built to work together, not as a one-off purchase."
          />

          <div className="relative mx-auto mt-10 max-w-4xl text-center sm:mt-16">
            <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-white/35 sm:mb-4 sm:text-[11px]">
              In the network you
            </p>
            <GooeyText
              texts={ecosystemMorph}
              morphTime={1.1}
              cooldownTime={0.85}
              className="mx-auto w-full"
              textClassName="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-7xl lg:text-8xl"
            />
          </div>

          <div data-stagger className="mt-8 grid gap-3 sm:mt-10 sm:gap-5 md:mt-14 md:grid-cols-2 xl:grid-cols-4">
            {ecosystem.map((item) => (
              <div
                key={item.title}
                data-stagger-item
                className="group rounded-2xl border border-white/10 bg-surface p-5 transition duration-300 hover:border-baby-blue/40 sm:rounded-[1.75rem] sm:p-8"
              >
                <h3 className="font-display text-2xl text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/60">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CohortSpotlight />

      {/* COURSES */}
      <section data-section-fade className="bg-ink py-16 sm:py-24 md:py-32">
        <div className="container-wide">
          <div className="flex flex-col justify-between gap-4 sm:gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Self-paced"
              title="Courses on Selar"
              description="Study strategy, AI, social systems, and more on your own schedule."
            />
            <Button
              href="/programs/courses"
              variant="secondary"
              className="w-full self-start sm:w-auto md:self-auto"
            >
              View catalogue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div data-stagger className="mt-8 grid gap-4 sm:mt-12 sm:gap-5 lg:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course.slug}
                data-stagger-item
                className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-surface transition duration-300 hover:border-baby-blue/30"
              >
                <div className="relative aspect-[16/10]" data-parallax-wrap>
                  <Image
                    src={course.image}
                    alt=""
                    fill
                    className="object-cover"
                    data-parallax
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="image-matte" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2">
                    {course.badge ? (
                      <span className="rounded-full bg-deep-blue px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                        {course.badge}
                      </span>
                    ) : null}
                    <span className="text-xs text-white/40">
                      {course.lessons} lessons · {course.duration}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-xl text-white">{course.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{course.summary}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm font-medium text-baby-blue">{course.price}</span>
                    <a
                      href={course.selarUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-white/80 transition hover:text-white"
                    >
                      Enroll on Selar
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section data-section-fade className="bg-near-black py-16 sm:py-24 md:py-36">
        <div className="container-wide grid items-center gap-8 sm:gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:aspect-[5/4] sm:rounded-[2rem]" data-parallax-wrap>
              <Image
                src="/images/events-rooftop.jpg"
                alt="Community networking event"
                fill
                className="object-cover"
                data-parallax
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="image-matte" />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div data-rule className="mb-8 h-px w-24 bg-mint/50" />
            <SectionHeading
              eyebrow="Community"
              title="The heart of the Network lives on Discord."
              description="Ask questions, share work, team up on projects, celebrate wins, and stay connected after a program ends."
            />
            <ul className="mt-8 space-y-3 text-white/70">
              <li>· Feedback and accountability from peers</li>
              <li>· Mentor AMAs and office hours</li>
              <li>· Channels for opportunities</li>
              <li>· The support many marketers wish they had earlier</li>
            </ul>
            <div className="btn-row-mobile mt-8 sm:mt-10">
              <Button href={site.discordInvite} target="_blank" rel="noreferrer">
                Join Discord
              </Button>
              <Button href="/community" variant="secondary">
                About community
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STORIES */}
      <section data-section-fade className="border-y border-white/10 bg-surface py-16 sm:py-24 md:py-32">
        <div className="container-wide">
          <div className="relative">
            <span className="pointer-events-none absolute -left-1 -top-6 font-display text-[5rem] leading-none text-white/5 sm:-left-2 sm:-top-10 sm:text-[8rem] md:text-[12rem]">
              “
            </span>
            <SectionHeading
              eyebrow="Success stories"
              title="People who put the work in"
            />
          </div>
          <div data-stagger className="mt-8 grid gap-4 sm:mt-14 sm:gap-6 md:grid-cols-2">
            {stories.map((story) => (
              <figure
                key={story.name}
                data-stagger-item
                className="rounded-[1.75rem] border border-white/10 bg-surface-2 p-6 md:p-8"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full">
                    <Image src={story.image} alt={story.name} fill className="object-cover" />
                  </div>
                  <div>
                    <figcaption className="font-display text-lg text-white">{story.name}</figcaption>
                    <p className="text-sm text-white/50">{story.role}</p>
                  </div>
                </div>
                <blockquote className="mt-6 text-base leading-relaxed text-white/75">
                  “{story.quote}”
                </blockquote>
              </figure>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/stories"
              className="inline-flex items-center gap-2 text-sm text-baby-blue hover:text-white"
            >
              More stories <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section data-section-fade className="bg-ink py-16 sm:py-24 md:py-32">
        <div className="container-wide">
          <div className="flex flex-col justify-between gap-4 sm:gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Events"
              title="Learn live. Meet your people."
              description="Webinars, workshops, and networking. Some free, some paid."
            />
            <Button href="/events" variant="secondary" className="w-full sm:w-auto">
              All events
            </Button>
          </div>
          <div data-stagger className="mt-8 grid gap-4 sm:mt-12 sm:gap-5 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event.slug}
                data-stagger-item
                className="rounded-[1.75rem] border border-white/10 bg-surface p-6 transition duration-500 hover:border-mint/30"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-mint">{event.type}</p>
                <h3 className="mt-3 font-display text-xl text-white">{event.title}</h3>
                <p className="mt-2 text-sm text-white/45">
                  {new Date(event.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  · {event.time}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-white/65">{event.summary}</p>
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-1 text-sm text-baby-blue hover:text-white"
                >
                  Register <ArrowUpRight className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* EMPLOYERS TEASER */}
      <section data-section-fade className="bg-near-black py-12 sm:py-24">
        <div className="container-wide overflow-hidden rounded-2xl border border-white/10 bg-deep-blue p-6 sm:rounded-[2rem] sm:p-8 md:p-14">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-baby-blue sm:text-xs">
                Employers & partners
              </p>
              <h2 className="mt-3 font-display text-2xl text-white sm:mt-4 sm:text-3xl md:text-4xl">
                Hire marketers who can think, not only post.
              </h2>
              <p className="mt-3 max-w-xl text-sm text-white/70 sm:mt-4 sm:text-base">
                Work with us on hiring, internships, client projects, guest sessions, and event sponsorships.
              </p>
            </div>
            <div className="btn-row-mobile lg:justify-end">
              <Button href="/employers" variant="light">
                Partner with us
              </Button>
              <Button href="/contact" variant="secondary">
                Submit a talent request
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section data-section-fade className="border-t border-white/10 bg-ink py-16 sm:py-28 md:py-36">
        <div className="container-page text-center">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.24em] text-baby-blue sm:text-xs">
              Join the network
            </p>
            <h2 className="mx-auto mt-3 max-w-3xl font-display text-2xl text-white sm:mt-4 sm:text-3xl md:text-5xl">
              The Social Marketers Network isn’t just where marketers learn.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/65 sm:mt-5 sm:text-base">
              It’s where marketers belong, grow, and build real careers.
            </p>
            <div className="btn-row-mobile mt-8 sm:mt-10">
              <Button href="/apply">Apply to the cohort</Button>
              <Button href="/programs/courses" variant="secondary">
                Browse courses
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </HomeStory>
  );
}
