import { img } from "@/lib/images";
import { homepageFounder } from "@/lib/pages/home";

/**
 * Static images the code pages already use. Blocks offer these as an optional
 * "Built-in image" so imported pages keep their pictures without uploads.
 * Values are GraphQL-safe slugs. An uploaded image always wins over a preset.
 */
export const imagePresets = {
  "hero-community": { src: img.hero3, alt: "Think Social Academy member" },
  "about-mission": { src: img.aboutMission, alt: "Instructor presenting to a room of learners" },
  founder: { src: img.instructor, alt: homepageFounder.name },
  "cohort-spotlight": { src: img.cohortSpotlight, alt: "TSA cohort learning together" },
  "mentorship-talk": { src: img.mentorshipTalk, alt: "One-on-one marketing training conversation" },
  "event-workshop": { src: img.eventWorkshop, alt: "Team marketing workshop in session" },
  "academy-group": { src: img.academyGroup, alt: "Think Social Academy learners together" },
  philosophy: { src: img.philosophy, alt: "Practical social media marketing work in progress" },
  "post-strategy": { src: img.postStrategy, alt: "Strategy notes and marketing planning materials" },
  "hire-conversation": { src: img.hireConversation, alt: "Partnership conversation between marketers" },
} as const;

export type ImagePresetKey = keyof typeof imagePresets;

export const imagePresetKeys = Object.keys(imagePresets) as ImagePresetKey[];

export function presetImage(key: string | null | undefined): { url: string; alt: string } | null {
  if (!key || !Object.prototype.hasOwnProperty.call(imagePresets, key)) return null;
  const preset = imagePresets[key as ImagePresetKey];
  return { url: preset.src, alt: preset.alt };
}
