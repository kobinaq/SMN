import type { ReactNode } from "react";
import { CardGridBlock } from "./CardGrid";
import { CourseListBlock } from "./CourseList";
import { CtaBandBlock } from "./CtaBand";
import { EnquiryFormBlock } from "./EnquiryForm";
import { FaqsBlock } from "./Faqs";
import { FounderStoryBlock } from "./FounderStory";
import { HeroBlock } from "./Hero";
import { NewsletterBlock } from "./Newsletter";
import { PartnerLogosBlock } from "./PartnerLogos";
import { PricePanelBlock } from "./PricePanel";
import { StepsBlock } from "./Steps";
import { TextSectionBlock } from "./TextSection";
import type { PageBlock } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
const renderers: Record<string, (props: any) => ReactNode | Promise<ReactNode>> = {
  hero: HeroBlock,
  "text-section": TextSectionBlock,
  "card-grid": CardGridBlock,
  "founder-story": FounderStoryBlock,
  steps: StepsBlock,
  faqs: FaqsBlock,
  "cta-band": CtaBandBlock,
  "partner-logos": PartnerLogosBlock,
  newsletter: NewsletterBlock,
  "enquiry-form": EnquiryFormBlock,
  "course-list": CourseListBlock,
  "price-panel": PricePanelBlock,
};

/** Renders a page layout. Unknown block types render nothing. */
export function RenderBlocks({ blocks }: { blocks?: PageBlock[] | null }) {
  if (!blocks?.length) return null;
  return (
    <>
      {blocks.map((block, i) => {
        const Component = renderers[block.blockType];
        if (!Component) return null;
        const { blockType: _type, id: _id, ...props } = block;
        void _type;
        void _id;
        const Render = Component as unknown as React.ComponentType<Record<string, unknown>>;
        return <Render key={block.id ?? i} {...props} />;
      })}
    </>
  );
}
