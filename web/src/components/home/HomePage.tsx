import { HomeStory } from "@/components/motion/HomeStory";
import { HeroPhotoGallery } from "@/components/home/HeroPhotoGallery";
import { FounderStory } from "@/components/home/FounderStory";
import { LearningOfferings } from "@/components/home/LearningOfferings";
import { WhoItsFor } from "@/components/home/WhoItsFor";
import { HomeValues } from "@/components/home/HomeValues";
import { GrowPreview } from "@/components/home/GrowPreview";
import { Testimonials } from "@/components/home/Testimonials";
import { PartnersBand } from "@/components/home/PartnersBand";
import { HomeSubscribe } from "@/components/home/HomeSubscribe";
import { getStories } from "@/lib/cms";

/**
 * Document order: hero, founder, offerings, audience, approach,
 * resources, learner experiences (only with approved stories),
 * partnerships, email subscription.
 */
export async function HomePage() {
  const stories = await getStories();

  return (
    <HomeStory>
      <HeroPhotoGallery />
      <FounderStory />
      <LearningOfferings />
      <WhoItsFor />
      <HomeValues />
      <GrowPreview />
      <Testimonials stories={stories} />
      <PartnersBand />
      <HomeSubscribe />
    </HomeStory>
  );
}
