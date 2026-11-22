import type { Block } from "payload";
import { CardGrid } from "./card-grid";
import { CourseList } from "./course-list";
import { CtaBand } from "./cta-band";
import { EnquiryFormBlock } from "./enquiry-form";
import { Faqs } from "./faqs";
import { FounderStory } from "./founder-story";
import { Hero } from "./hero";
import { Newsletter } from "./newsletter";
import { PartnerLogos } from "./partner-logos";
import { PricePanel } from "./price-panel";
import { Steps } from "./steps";
import { TextSection } from "./text-section";

/** The first block set. No raw HTML, code, custom CSS, layout, column or embed blocks. */
export const pageBlocks: Block[] = [
  Hero,
  TextSection,
  CardGrid,
  FounderStory,
  Steps,
  Faqs,
  CtaBand,
  PartnerLogos,
  Newsletter,
  EnquiryFormBlock,
  CourseList,
  PricePanel,
];
