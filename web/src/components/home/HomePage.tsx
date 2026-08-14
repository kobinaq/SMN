import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HomeStory } from "@/components/motion/HomeStory";
import { Reveal } from "@/components/motion/Reveal";
import { HeroPhotoGallery } from "@/components/home/HeroPhotoGallery";
import { CohortSpotlight } from "@/components/home/CohortSpotlight";
import { GooeyText } from "@/components/motion/GooeyText";
import { audienceStages } from "@/lib/brand";
import { ecosystem, excerptStoryQuote, instructor } from "@/lib/content";
import { img } from "@/lib/images";
import { cta } from "@/lib/cta";
import {
  getCourses,
  getEvents,
  getStories,
  getVerifiedImpactStats,
  getSiteSettings,
} from "@/lib/cms";

const ecosystemMorph = ["Learn", "Practice", "Connect", "Grow"];

export async function HomePage() {
  const [site, courses, events, stories, impactStats] = await Promise.all([
    getSiteSettings(),
    getCourses(),
    getEvents(),
    getStories(),
    getVerifiedImpactStats(),
  ]);

  const featuredEvents = events.slice(0, 3);
  const featuredCourses = courses.slice(0, 3);
  const homeStories = stories.slice(0, 4);

  return (
    <HomeStory>
      <HeroPhotoGallery />

      {impactStats.length ? (
        <section data-section-fade className="border-y border-white/10 bg-surface py-12 sm:py-16">
          <div className="container-wide">
            <div data-stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {impactStats.map((stat) => (
                <div
                  key={stat.label}
                  data-stagger-item
                  className="rounded-2xl border border-white/10 bg-surface-2 px-5 py-6 text-center"
                >
                  <p className="font-display text-3xl text-white">{stat.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/45">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Philosophy */}
      <section
        data-pin-chapter
        data-section-fade
        className="relative overflow-hidden bg-ink py-16 sm:py-24 md:py-36"
      >
        <div className="container-wide grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-14">
          <div>
            <div data-rule className="mb-6 h-px w-24 bg-baby-blue/60 sm:mb-8" />
            <p data-line className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue sm:text-xs">
              Our belief
            </p>
            <h2
              data-line
              className="mt-3 font-display text-2xl leading-tight text-white sm:mt-4 sm:text-3xl md:text-5xl"
            >
              Marketing is changing. How we learn it should too.
            </h2>
            <p data-line className="mt-4 text-base leading-relaxed text-white/65 sm:mt-6 sm:text-lg">
              People learn Canva, Reels, and AI tools without necessarily learning how to think like
              marketers. Businesses need people who understand audiences, communicate clearly, and
              connect activity to outcomes.
            </p>
            <p data-line className="mt-3 text-base leading-relaxed text-white/65 sm:mt-4 sm:text-lg">
              SMN exists to close that gap. Learning, community, experience, and opportunity live in
              one ecosystem, not a single class.
            </p>
          </div>
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:aspect-[4/5] sm:rounded-[2rem] md:aspect-[5/4]"
            data-parallax-wrap
          >
            <Image
              src={img.philosophy}
              alt="Two marketers in a thoughtful one-to-one conversation"
              fill
              className="object-cover"
              data-parallax
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="image-matte" />
          </div>
        </div>
      </section>

      <section data-section-fade className="bg-near-black py-16 sm:py-24 md:py-36">
        <div className="container-wide">
          <div data-rule className="mb-8 h-px w-full bg-white/10 sm:mb-10" />
          <SectionHeading
            title="Learn. Practice. Connect. Grow."
            description="Members learn, practise, get support, and find opportunities inside one network. A course can teach a skill. A network can change the trajectory of a career."
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

          <div data-stagger className="mt-8 grid gap-3 sm:mt-10 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
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

      <section data-section-fade className="border-t border-white/10 bg-ink py-16 sm:py-24 md:py-32">
        <div className="container-wide">
          <SectionHeading
            title="Built for marketers at different stages of the journey."
            description="Whether you are starting out, already in the work, or building a business, there is a place in the Network."
          />
          <div data-stagger className="mt-8 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-2">
            {audienceStages.map((item) => (
              <div
                key={item.title}
                data-stagger-item
                className="rounded-2xl border border-white/10 bg-surface p-6 sm:rounded-[1.75rem] sm:p-8"
              >
                <h3 className="font-display text-xl text-white sm:text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CohortSpotlight />

      {/* Learning experience */}
      <section data-section-fade className="bg-ink py-16 sm:py-24 md:py-32">
        <div className="container-wide">
          <div className="flex flex-col justify-between gap-4 sm:gap-6 md:flex-row md:items-end">
            <SectionHeading
              title="Learn marketing at your own pace."
              description="Focused courses for specific skills when you are not committing to the full training programme. Purchase unlocks portal access."
            />
            <Button href={cta.viewCourses.href} variant="secondary" className="w-full self-start sm:w-auto">
              {cta.viewCourses.label}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div data-stagger className="mt-8 grid gap-4 sm:mt-12 sm:gap-5 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <article
                key={course.slug}
                data-stagger-item
                className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-surface transition duration-300 hover:border-baby-blue/30"
              >
                <div className="relative aspect-[16/10]" data-parallax-wrap>
                  <Image
                    src={course.image}
                    alt={course.title}
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
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-baby-blue">{course.price}</span>
                    <a
                      href={course.commerce === "apply" ? "/apply" : "/programs/courses"}
                      className="inline-flex items-center gap-1 text-sm text-white/80 transition hover:text-white"
                    >
                      {course.commerce === "apply" ? cta.applyCohort.shortLabel : cta.buyCourse.label}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Instructor */}
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
              Meet the lead instructor
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
            <div className="btn-row-mobile mt-8 sm:mt-10">
              <Button href={instructor.linkedin} target="_blank" rel="noreferrer">
                View LinkedIn
              </Button>
              <Button href={cta.applyCohort.href} variant="secondary">
                {cta.applyCohort.shortLabel}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mentorship & community */}
      <section data-section-fade className="bg-near-black py-16 sm:py-24 md:py-36">
        <div className="container-wide grid items-center gap-8 sm:gap-12 lg:grid-cols-2">
          <Reveal>
            <div
              className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:aspect-[5/4] sm:rounded-[2rem]"
              data-parallax-wrap
            >
              <Image
                src={img.communityHome}
                alt="SMN gathering with a speaker, audience, and Own your voice tote"
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
              title="You should not have to figure out your marketing career alone."
              description="Ask questions, find mentors, discover opportunities, and stay connected after a course ends. Mentorship lives in the portal. Day-to-day conversation lives on WhatsApp."
            />
            <ul className="mt-8 space-y-3 text-white/70">
              <li>· Learn together: ideas, tools, and industry changes</li>
              <li>· Ask questions and find mentors</li>
              <li>· Discover jobs, internships, and projects</li>
              <li>· Stay connected after a course ends</li>
            </ul>
            <div className="btn-row-mobile mt-8 sm:mt-10">
              <Button href="/mentorship" variant="secondary">
                How mentorship works
              </Button>
              <Button href="/community" variant="ghost">
                About the community
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {homeStories.length ? (
        <section data-section-fade className="border-y border-white/10 bg-surface py-16 sm:py-24 md:py-32">
          <div className="container-wide">
            <SectionHeading
              title="See what happens when learning becomes practice."
              description="Members build skills, portfolios, confidence, and experience. Stories appear here when they are published with permission."
            />
            <div data-stagger className="mt-8 grid gap-4 sm:mt-14 sm:gap-6 md:grid-cols-2">
              {homeStories.map((story) => (
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
                      {story.programme ? (
                        <p className="mt-1 text-xs text-white/35">{story.programme}</p>
                      ) : null}
                    </div>
                  </div>
                  <blockquote className="mt-6 text-base leading-relaxed text-white/75">
                    “{excerptStoryQuote(story.quote)}”
                  </blockquote>
                </figure>
              ))}
            </div>
            <div className="mt-10">
              <div className="btn-row-mobile">
                <Button href="/stories" variant="secondary">
                  Member stories
                </Button>
                <Button href="/programs" variant="ghost">
                  Explore the Academy
                </Button>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Events */}
      {featuredEvents.length ? (
        <section data-section-fade className="bg-ink py-16 sm:py-24 md:py-32">
          <div className="container-wide">
            <div className="flex flex-col justify-between gap-4 sm:gap-6 md:flex-row md:items-end">
              <SectionHeading
                title="Come learn with us."
                description="Webinars, workshops, community events, and industry conversations."
              />
              <Button href="/events" variant="secondary" className="w-full sm:w-auto">
                All events
              </Button>
            </div>
            <div data-stagger className="mt-8 grid gap-4 sm:mt-12 sm:gap-5 lg:grid-cols-3">
              {featuredEvents.map((event) => (
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
                    href={`/events/${event.slug}`}
                    className="mt-6 inline-flex items-center gap-1 text-sm text-baby-blue hover:text-white"
                  >
                    Register for event <ArrowUpRight className="h-4 w-4" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Employer pathway */}
      <section data-section-fade className="bg-near-black py-12 sm:py-24">
        <div className="container-wide overflow-hidden rounded-2xl border border-white/10 bg-deep-blue p-6 sm:rounded-[2rem] sm:p-8 md:p-14">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-baby-blue sm:text-xs">
                Partners
              </p>
              <h2 className="mt-3 font-display text-2xl text-white sm:mt-4 sm:text-3xl md:text-4xl">
                Build with the next generation of marketers.
              </h2>
              <p className="mt-3 max-w-xl text-sm text-white/70 sm:mt-4 sm:text-base">
                Train teams, hire SMN talent, collaborate on events and briefs, or sponsor access to
                training and experience.
              </p>
            </div>
            <div className="btn-row-mobile lg:justify-end">
              <Button href={cta.partner.href} variant="light">
                {cta.partner.label}
              </Button>
              <Button href={cta.hireTalent.href} variant="secondary">
                {cta.hireTalent.label}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section data-section-fade className="border-t border-white/10 bg-ink py-16 sm:py-28 md:py-36">
        <div className="container-page text-center">
          <Reveal>
            <p className="text-[10px] uppercase tracking-[0.24em] text-baby-blue sm:text-xs">
              Next step
            </p>
            <h2 className="mx-auto mt-3 max-w-3xl font-display text-2xl text-white sm:mt-4 sm:text-3xl md:text-5xl">
              This is only the beginning.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-white/65 sm:mt-5 sm:text-base">
              Apply to the next cohort, or join the community and stay connected while you decide.
              Payment comes after acceptance, not before you apply. Next intake {site.cohort.startDate}.
            </p>
            <div className="btn-row-mobile mt-8 sm:mt-10">
              <Button href={cta.applyCohort.href}>{cta.applyCohort.label}</Button>
              <Button href={cta.viewCourses.href} variant="secondary">
                {cta.viewCourses.label}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </HomeStory>
  );
}
