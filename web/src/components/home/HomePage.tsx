import { HomeStory } from "@/components/motion/HomeStory";
import { HeroPhotoGallery } from "@/components/home/HeroPhotoGallery";
import { FounderStory } from "@/components/home/FounderStory";
import { LearningOfferings } from "@/components/home/LearningOfferings";
import { WhoItsFor } from "@/components/home/WhoItsFor";
import { HomeValues } from "@/components/home/HomeValues";
import { GrowPreview } from "@/components/home/GrowPreview";
import { Testimonials } from "@/components/home/Testimonials";
import { PartnersBand } from "@/components/home/PartnersBand";
import { getStories } from "@/lib/cms";
import { learnerExperiencesEnabled } from "@/lib/features";

/**
 * Document order: hero, founder, offerings, audience, approach,
 * resources, learner experiences (flagged off until testimonials are approved),
 * partnerships. The footer carries the email subscription.
 */
export async function HomePage() {
  const stories = learnerExperiencesEnabled ? await getStories() : [];

  return (
    <HomeStory>
      <HeroPhotoGallery />
      <FounderStory />
      <LearningOfferings />
      <WhoItsFor />
      <HomeValues />
      <GrowPreview />
      {learnerExperiencesEnabled ? <Testimonials stories={stories} /> : null}
      <PartnersBand />
    </HomeStory>
  );
}
