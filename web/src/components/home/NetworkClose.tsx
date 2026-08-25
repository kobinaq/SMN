import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { cta } from "@/lib/cta";
import { homepageClose } from "@/lib/content";
import { img } from "@/lib/images";

const [pullQuote, ...body] = homepageClose.paragraphs;

export function NetworkClose() {
  return (
    <section data-section-fade className="border-t border-white/10 bg-ink py-16 sm:py-24 md:py-32">
      <div className="container-wide grid items-end gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
        <div>
          <p className="text-sm text-white/50">{homepageClose.lead}</p>
          <h2 className="mt-3 max-w-xl font-display text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl">
            {homepageClose.title}
          </h2>
          <p className="mt-8 max-w-[28ch] font-display text-2xl leading-snug text-white sm:text-3xl">
            {pullQuote}
          </p>
          <div className="mt-8 max-w-[60ch] space-y-4 text-sm leading-relaxed text-white/60 sm:text-base">
            {body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-10">
            <Button href={cta.joinCommunity.href}>Join the Community</Button>
          </div>
        </div>

        <div
          className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-[2rem] lg:aspect-[4/5]"
          data-parallax-wrap
        >
          <Image
            src={img.communityHome}
            alt="SMN gathering with a speaker, audience, and Own your voice tote"
            fill
            className="object-cover"
            data-parallax
            sizes="(max-width: 1024px) 100vw, 42vw"
          />
          <div className="image-matte" />
        </div>
      </div>
    </section>
  );
}
