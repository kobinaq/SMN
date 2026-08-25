import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { homepageFounderStory, instructor, smnValues } from "@/lib/content";

export function FounderStory() {
  return (
    <>
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
      </section>

      <section data-section-fade className="border-t border-white/10 bg-near-black py-16 sm:py-24 md:py-32">
        <div className="container-wide">
          <h2 className="font-display text-3xl leading-tight text-white sm:text-4xl md:text-5xl">
            Our values
          </h2>

          <ol data-stagger className="mt-12 sm:mt-16">
            {smnValues.map((value, index) => (
              <li
                key={value.title}
                data-stagger-item
                className="grid gap-4 border-t border-white/10 py-8 last:border-b sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-10 sm:py-12"
              >
                <span className="font-display text-4xl leading-none text-baby-blue/75 sm:text-5xl">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-2xl leading-tight text-white sm:text-3xl md:text-4xl">
                    {value.title}
                  </h3>
                  <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-white/60 sm:mt-4 sm:text-base">
                    {value.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
