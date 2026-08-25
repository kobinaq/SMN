import { HomeStory } from "@/components/motion/HomeStory";
import { HeroPhotoGallery } from "@/components/home/HeroPhotoGallery";
import { FounderStory } from "@/components/home/FounderStory";
import { EcosystemPillars } from "@/components/home/EcosystemPillars";
import { AudienceStages } from "@/components/home/AudienceStages";
import { CohortSpotlight } from "@/components/home/CohortSpotlight";
import { UpcomingEvents } from "@/components/home/UpcomingEvents";
import { Testimonials } from "@/components/home/Testimonials";
import { PartnersBand } from "@/components/home/PartnersBand";
import { NetworkClose } from "@/components/home/NetworkClose";
import { getEvents, getStories } from "@/lib/cms";

export async function HomePage() {
  const [events, stories] = await Promise.all([getEvents(), getStories()]);

  return (
    <HomeStory>
      <HeroPhotoGallery />
      <FounderStory />
      <EcosystemPillars />
      <AudienceStages />
      <CohortSpotlight />
      <UpcomingEvents events={events.slice(0, 3)} />
      <Testimonials stories={stories.slice(0, 4)} />
      <PartnersBand />
      <NetworkClose />
    </HomeStory>
  );
}
