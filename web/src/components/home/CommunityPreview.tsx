import { Button } from "@/components/ui/Button";
import { Band, Kicker } from "@/components/site/kit";
import { homepageConnect } from "@/lib/pages/home";

/** Doc Section 6 — community without overpromising. */
export function CommunityPreview() {
  return (
    <Band tone="light" size="lg" fade>
      <Kicker>Connect</Kicker>
      <h2 className="mt-5 max-w-[18ch] font-display display-2 text-text-1">{homepageConnect.title}</h2>
      <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-text-2 sm:text-lg">
        {homepageConnect.body}
      </p>
      <div className="mt-8">
        <Button href={homepageConnect.ctaHref}>{homepageConnect.ctaLabel}</Button>
      </div>
    </Band>
  );
}
