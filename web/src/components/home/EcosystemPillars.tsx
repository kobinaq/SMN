import { Band, Kicker } from "@/components/site/kit";
import { GooeyText } from "@/components/motion/GooeyText";
import { ecosystem } from "@/lib/content";

const WORDS = ["Learn", "Practice", "Connect", "Grow"];

/** The four-part promise, morphing word into word above a two-up list. */
export function EcosystemPillars() {
  return (
    <Band tone="light" size="lg" fade>
      <div className="text-center">
        <Kicker className="justify-center">The ecosystem</Kicker>
        <h2 className="sr-only">Learn. Practice. Connect. Grow.</h2>
        <div className="relative mx-auto mt-8 h-20 max-w-4xl sm:h-28 md:h-36" aria-hidden>
          <GooeyText
            texts={WORDS}
            morphTime={1.1}
            cooldownTime={0.85}
            className="mx-auto h-full w-full"
            textClassName="font-display display-1 text-text-1"
          />
        </div>
      </div>

      <div data-stagger className="mt-16 grid gap-x-16 sm:grid-cols-2">
        {ecosystem.map((item, index) => (
          <div
            key={item.title}
            data-stagger-item
            className="grid gap-4 rule py-8 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-6 sm:py-10"
          >
            <span aria-hidden className="ordinal text-accent/50">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-display display-3 text-text-1">{item.title}</h3>
              <p className="mt-3 max-w-[42ch] text-sm leading-relaxed text-text-2 sm:text-base">{item.body}</p>
              {item.kicker ? <p className="mt-4 eyebrow text-accent">{item.kicker}</p> : null}
            </div>
          </div>
        ))}
      </div>
    </Band>
  );
}
