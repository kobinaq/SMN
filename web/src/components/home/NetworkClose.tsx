import { Button } from "@/components/ui/Button";
import { cta } from "@/lib/cta";
import { homepageClose } from "@/lib/content";

export function NetworkClose() {
  return (
    <section data-section-fade className="border-t border-white/10 bg-ink py-16 sm:py-28 md:py-36">
      <div className="container-page">
        <p className="text-sm text-white/50">{homepageClose.lead}</p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl text-white sm:text-4xl md:text-5xl">
          {homepageClose.title}
        </h2>
        <div className="mt-6 max-w-[65ch] space-y-4 text-sm leading-relaxed text-white/65 sm:text-base">
          {homepageClose.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-8 sm:mt-10">
          <Button href={cta.joinCommunity.href}>Join the Community</Button>
        </div>
      </div>
    </section>
  );
}
