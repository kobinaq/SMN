import Image from "next/image";
import { Band, Kicker } from "@/components/site/kit";
import { img } from "@/lib/images";
import { homepageValues } from "@/lib/pages/home";

/** Doc Section 5 - teaching values. */
export function HomeValues() {
  return (
    <Band tone="canvas" size="lg" fade>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <Kicker>Values</Kicker>
          <h2 className="mt-5 font-display display-2 text-text-1">{homepageValues.title}</h2>
          <ul className="mt-10 space-y-0 border-t border-edge-subtle">
            {homepageValues.items.map((item) => (
              <li key={item.title} className="border-b border-edge-subtle py-5">
                <h3 className="font-display text-xl text-text-1">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-2 sm:text-base">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden lg:aspect-[5/6]" data-parallax-wrap>
          <Image
            src={img.philosophy}
            alt="Practical social media marketing work in progress"
            fill
            className="object-cover"
            data-parallax
            sizes="(max-width: 1024px) 100vw, 42vw"
          />
        </div>
      </div>
    </Band>
  );
}
