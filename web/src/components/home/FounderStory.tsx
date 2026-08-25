import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { homepageFounderStory, instructor, smnValues } from "@/lib/content";

export function FounderStory() {
  return (
    <section data-section-fade className="bg-ink py-16 sm:py-24 md:py-32">
      <div className="container-wide grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
        <Reveal className="lg:sticky lg:top-28">
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
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="image-matte" />
          </div>
        </Reveal>

        <div>
          <p className="text-sm leading-relaxed text-white/55">
            Meet the Founder & Lead Instructor
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight text-white sm:text-4xl md:text-5xl">
            {instructor.name}
          </h2>
          <div className="mt-8 max-w-[65ch] space-y-5 text-sm leading-relaxed text-white/70 sm:text-base">
            {homepageFounderStory.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
          <a
            href={instructor.linkedin}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex text-sm text-baby-blue transition hover:text-white"
          >
            {instructor.name} on LinkedIn
          </a>
        </div>
      </div>

      <div className="container-wide mt-16 sm:mt-24">
        <h3 className="font-display text-2xl text-white sm:text-3xl">Our values</h3>
        <dl data-stagger className="mt-8 max-w-3xl divide-y divide-white/10 border-y border-white/10">
          {smnValues.map((value) => (
            <div
              key={value.title}
              data-stagger-item
              className="grid gap-2 py-6 sm:grid-cols-[14rem_1fr] sm:gap-8 sm:py-7"
            >
              <dt className="font-display text-lg text-white sm:text-xl">{value.title}</dt>
              <dd className="text-sm leading-relaxed text-white/65 sm:text-base">{value.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
