import { HomeStory } from "@/components/motion/HomeStory";
import { FounderStory } from "@/components/home/FounderStory";
import { HeroPhotoGallery } from "@/components/home/HeroPhotoGallery";
import { LearningOfferings } from "@/components/home/LearningOfferings";
import { WhoItsFor } from "@/components/home/WhoItsFor";
import { HomeValues } from "@/components/home/HomeValues";
import { CommunityPreview } from "@/components/home/CommunityPreview";
import { GrowPreview } from "@/components/home/GrowPreview";
import { Testimonials } from "@/components/home/Testimonials";
import { PartnersBand } from "@/components/home/PartnersBand";
import { getStories } from "@/lib/cms";

/**
 * Website Structure doc homepage order:
 * founder → hero → offerings → audience → values → connect → grow → testimonials → partner.
 */
export async function HomePage() {
  const stories = await getStories();

  return (
    <HomeStory>
      <FounderStory />
      <HeroPhotoGallery />
      <LearningOfferings />
      <WhoItsFor />
      <HomeValues />
      <CommunityPreview />
      <GrowPreview />
      <Testimonials stories={stories.slice(0, 4)} />
      <PartnersBand />
    </HomeStory>
  );
}
