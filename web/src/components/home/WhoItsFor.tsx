import Image from "next/image";
import { Band, Kicker } from "@/components/site/kit";
import { img } from "@/lib/images";
import { homepageAudience } from "@/lib/pages/home";

/** Doc Section 4 - audience. */
export function WhoItsFor() {
  return (
    <Band tone="raised" size="lg" fade>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden lg:aspect-[5/6]" data-parallax-wrap>
          <Image
            src={img.academyGroup}
            alt="Think Social Academy learners together"
            fill
            className="object-cover object-[center_20%]"
            data-parallax
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={85}
          />
        </div>
        <div>
          <Kicker>Audience</Kicker>
          <h2 className="mt-5 font-display display-2 text-text-1">{homepageAudience.title}</h2>
          <ul className="mt-10 space-y-0 border-t border-edge-subtle">
            {homepageAudience.items.map((item) => (
              <li key={item.title} className="border-b border-edge-subtle py-5">
                <h3 className="font-display text-xl text-text-1">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-2 sm:text-base">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Band>
  );
}
