import { audienceStages } from "@/lib/brand";

export function AudienceStages() {
  return (
    <section data-section-fade className="border-t border-white/10 bg-ink py-16 sm:py-24 md:py-32">
      <div className="container-wide">
        <h2 className="max-w-3xl font-display text-2xl leading-tight text-white sm:text-3xl md:text-5xl">
          Built for marketers at different stages of the journey.
        </h2>
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
  );
}
