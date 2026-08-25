import { GooeyText } from "@/components/motion/GooeyText";
import { ecosystem } from "@/lib/content";

const ecosystemMorph = ["Learn", "Practice", "Connect", "Grow"];

export function EcosystemPillars() {
  return (
    <section data-section-fade className="bg-near-black py-16 sm:py-24 md:py-36">
      <div className="container-wide">
        <h2 className="text-center font-display text-2xl leading-tight text-white sm:text-3xl md:text-5xl">
          Learn. Practice. Connect. Grow.
        </h2>
        <div className="relative mx-auto mt-10 max-w-4xl text-center sm:mt-14">
          <GooeyText
            texts={ecosystemMorph}
            morphTime={1.1}
            cooldownTime={0.85}
            className="mx-auto w-full"
            textClassName="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-7xl lg:text-8xl"
          />
        </div>

        <ol data-stagger className="mt-12 space-y-0 sm:mt-16">
          {ecosystem.map((item, index) => (
            <li
              key={item.title}
              data-stagger-item
              className="grid gap-3 border-t border-white/10 py-8 last:border-b sm:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] sm:items-baseline sm:gap-10 sm:py-10"
            >
              <p className="font-display text-3xl text-white sm:text-4xl md:text-5xl">
                <span className="mr-3 font-sans text-xs uppercase tracking-[0.22em] text-white/35">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.title}
              </p>
              <div>
                {item.kicker ? (
                  <p className="text-sm font-medium text-baby-blue sm:text-base">{item.kicker}</p>
                ) : null}
                <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-white/65 sm:text-base">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
