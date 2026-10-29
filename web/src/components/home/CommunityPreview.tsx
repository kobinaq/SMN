import { Button } from "@/components/ui/Button";
import { Band, Kicker } from "@/components/site/kit";
import { cta } from "@/lib/cta";
import { homepageCommunity } from "@/lib/content";
import { site } from "@/lib/site";

/** Tab 4 Community preview with Tab 5 community language. */
export function CommunityPreview() {
  return (
    <Band tone="light" size="lg" fade>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-16">
        <div>
          <Kicker>Community</Kicker>
          <h2 className="mt-5 font-display display-2 text-text-1">{homepageCommunity.title}</h2>
          <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-text-2 sm:text-lg">
            {homepageCommunity.body}
          </p>
          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button href={cta.joinCommunity.href}>{cta.joinCommunity.label}</Button>
            {/* Home-only label. Shared cta.whatsapp.communityLabel waits for #54 rebase. */}
            <a
              href={site.whatsappInvite}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 min-w-11 items-center text-sm text-text-3 underline-offset-4 hover:text-text-1 hover:underline"
            >
              Also get TSA updates on WhatsApp
            </a>
          </div>
        </div>
        <ul className="border-t border-edge-subtle">
          {homepageCommunity.items.map((item) => (
            <li
              key={item}
              className="border-b border-edge-subtle py-4 text-sm text-text-2 sm:text-base"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Band>
  );
}
