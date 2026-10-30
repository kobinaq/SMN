import { Button } from "@/components/ui/Button";
import { Band, Kicker } from "@/components/site/kit";
import { homepageWhatIs } from "@/lib/content";

/** Tab 4 What is TSA section. */
export function WhatIsTsa() {
  return (
    <Band size="lg" fade>
      <div className="max-w-3xl">
        <Kicker>What is TSA?</Kicker>
        <h2 className="mt-5 font-display display-2 text-text-1">{homepageWhatIs.title}</h2>
        <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-text-2 sm:text-lg">
          {homepageWhatIs.body}
        </p>
        <div className="mt-8">
          <Button href={homepageWhatIs.ctaHref} variant="secondary">
            {homepageWhatIs.ctaLabel}
          </Button>
        </div>
      </div>
    </Band>
  );
}
