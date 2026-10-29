import { HomeStory } from "@/components/motion/HomeStory";
import { HeroPhotoGallery } from "@/components/home/HeroPhotoGallery";
import { WhatIsTsa } from "@/components/home/WhatIsTsa";
import { FounderStory } from "@/components/home/FounderStory";
import { EcosystemPillars } from "@/components/home/EcosystemPillars";
import { ExploreTsa } from "@/components/home/ExploreTsa";
import { AcademyPreview } from "@/components/home/AcademyPreview";
import { Outcomes } from "@/components/home/Outcomes";
import { CommunityPreview } from "@/components/home/CommunityPreview";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { Testimonials } from "@/components/home/Testimonials";
import { ResourcesPreview } from "@/components/home/ResourcesPreview";
import { PartnersBand } from "@/components/home/PartnersBand";
import { NetworkClose } from "@/components/home/NetworkClose";
import { getEvents, getResources, getStories } from "@/lib/cms";

/**
 * Tab 4 home section order, with Tab 5 copy rules and PR #54 facts
 * (4-week cohort, Join the Community → /signup, no hire/SMN promises).
 */
export async function HomePage() {
  const [events, stories, resources] = await Promise.all([
    getEvents(),
    getStories(),
    getResources(),
  ]);

  return (
    <HomeStory>
      <HeroPhotoGallery />
      <WhatIsTsa />
      <FounderStory />
      <EcosystemPillars />
      <ExploreTsa />
      <AcademyPreview />
      <Outcomes />
      <CommunityPreview />
      <UpcomingEvents events={events.slice(0, 3)} />
      <Testimonials stories={stories.slice(0, 4)} />
      <ResourcesPreview resources={resources.slice(0, 3)} />
      <PartnersBand />
      <NetworkClose />
    </HomeStory>
  );
}
