import { Button } from "@/components/ui/Button";
import { Band, Kicker, Marquee } from "@/components/site/kit";
import { cta } from "@/lib/cta";
import { homepagePartners } from "@/lib/content";

/** What partners can do with the network, on the brand's blue as ground. */
const OFFERS = [
  "Train your team",
  "Hire an intern",
  "Co-host an event",
  "Sponsor a seat",
  "Set a live brief",
  "Speak to a cohort",
];

export function PartnersBand() {
  return (
    <Band tone="blue" size="lg" fade>
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
        <div>
          <Kicker>Partners</Kicker>
          <h2 className="mt-6 font-display display-2 text-text-1">{homepagePartners.title}</h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-text-2 sm:text-lg">
            {homepagePartners.body}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Button href={cta.partner.href} variant="light">
            {cta.partner.label}
          </Button>
          <Button href={cta.hireTalent.href} variant="secondary">
            {cta.hireTalent.label}
          </Button>
        </div>
      </div>

      <Marquee className="mt-16 border-y border-edge py-5" duration={45}>
        {OFFERS.map((offer) => (
          <span key={offer} className="flex items-center gap-6 whitespace-nowrap px-6 font-display text-2xl text-text-2 sm:text-3xl">
            {offer}
            <span aria-hidden className="text-text-3">
              /
            </span>
          </span>
        ))}
      </Marquee>

      <p className="mt-14 max-w-3xl font-display display-3 text-text-1">{homepagePartners.close}</p>
    </Band>
  );
}
