import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Band, Checklist, CtaBand, DefinitionGrid, Masthead, SectionHead } from "@/components/site/kit";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { excerptStoryQuote } from "@/lib/content";
import { seoTitle } from "@/lib/brand";
import { cta } from "@/lib/cta";
import { img } from "@/lib/images";
import { getEvents, getSiteSettings, getStories } from "@/lib/cms";
import { itemShareImages } from "@/lib/share-metadata";
import {
  communityAccess,
  communityEarlyAccess,
  communityHero,
  communityIdea,
  communityMentors,
  communityMetadata,
  communityStories,
} from "@/lib/community-copy";

export async function generateMetadata(
  _props: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const parentMeta = await parent;
  // Forward parent hashed OG defaults when setting openGraph.url (T3 canonical),
  // so job URLs that 308 here still expose a working share image (#49).
  const share = itemShareImages(null, {
    openGraphImages: parentMeta.openGraph?.images,
    twitterImages: parentMeta.twitter?.images,
  });
  return {
    title: seoTitle(communityMetadata.title),
    description: communityMetadata.description,
    alternates: { canonical: "/connect" },
    openGraph: {
      url: "/connect",
      ...(share.openGraphImages ? { images: share.openGraphImages } : {}),
    },
    ...(share.twitterImages
      ? { twitter: { card: "summary_large_image", images: share.twitterImages } }
      : {}),
  };
}

export const revalidate = 60;

/** Secondary WhatsApp text link. Only ever rendered after a signup CTA. */
function WhatsAppUpdatesLink({ href }: { href?: string | null }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-11 min-w-11 items-center text-sm text-text-2 underline underline-offset-4 hover:text-text-1"
    >
      {cta.whatsapp.communityLabel}
    </a>
  );
}

/** Events from today onwards, soonest first. The band hides itself when empty. */
function selectUpcoming<T extends { date: string }>(events: T[], limit = 3) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  return events
    .filter((event) => {
      const time = Date.parse(event.date);
      return !Number.isNaN(time) && time >= startOfToday.getTime();
    })
    .slice(0, limit);
}

export default async function CommunityPage() {
  const [site, stories, events] = await Promise.all([
    getSiteSettings(),
    getStories(),
    getEvents(),
  ]);
  const memberStories = stories.slice(0, 4);
  const upcoming = selectUpcoming(events);

  return (
    <>
      <Masthead
        image={img.communityPortrait}
        alt="Two TSA members sitting together"
        kicker={communityHero.kicker}
        title={communityHero.title}
        lede={communityHero.lede}
        actions={
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button href={cta.joinTsa.href}>{cta.joinCommunity.label}</Button>
            <WhatsAppUpdatesLink href={site.whatsappInvite} />
          </div>
        }
        meta={communityHero.note}
      />

      <Band size="lg">
        <SectionHead
          kicker={communityAccess.kicker}
          title={communityAccess.title}
          lede={communityAccess.lede}
        />
        <DefinitionGrid className="mt-12" items={[...communityAccess.items]} />
      </Band>

      <Band tone="raised" size="lg">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHead
              align="stacked"
              kicker={communityEarlyAccess.kicker}
              title={communityEarlyAccess.title}
              lede={communityEarlyAccess.lede}
            />
            <Checklist className="mt-8" items={communityEarlyAccess.items} />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden lg:aspect-[5/4]">
            <Image
              src={img.communityCollab}
              alt="Members in a focused table conversation"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </Band>

      <UpcomingEvents events={upcoming} />

      <Band size="lg">
        <SectionHead
          kicker={communityMentors.kicker}
          title={communityMentors.title}
          lede={communityMentors.lede}
          actions={
            <Button href={communityMentors.href} variant="secondary">
              {communityMentors.ctaLabel}
            </Button>
          }
        />
      </Band>

      {memberStories.length ? (
        <Band id="stories" tone="raised" size="lg" className="scroll-mt-24">
          <SectionHead align="stacked" kicker={communityStories.kicker} title={communityStories.title} />
          <div className="mt-12 grid gap-px overflow-hidden border border-edge-subtle bg-edge-subtle md:grid-cols-2">
            {memberStories.map((story) => (
              <figure key={story.name} className="flex flex-col bg-canvas p-7 sm:p-9">
                <blockquote className="font-display text-xl leading-snug text-text-1 sm:text-2xl">
                  &ldquo;{excerptStoryQuote(story.quote)}&rdquo;
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4 rule pt-6">
                  <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                    <Image src={story.image} alt="" fill className="object-cover" sizes="44px" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-text-1">{story.name}</span>
                    <span className="block text-sm text-text-3">{story.role}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Band>
      ) : null}

      <CtaBand
        kicker={communityIdea.kicker}
        title={communityIdea.title}
        lede={communityIdea.lede}
        actions={
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Button href={cta.joinTsa.href}>{communityIdea.ctaLabel}</Button>
            <WhatsAppUpdatesLink href={site.whatsappInvite} />
          </div>
        }
      />
    </>
  );
}
