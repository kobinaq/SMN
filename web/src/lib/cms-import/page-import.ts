/**
 * Maps today's code pages (src/lib/pages/*) onto Page data for the 2D blocks.
 * Every visible string is the same constant the code page renders: nothing is
 * retyped or rewritten here. Uploads are never imported; images use the
 * built-in `imagePreset` allowlist instead.
 */
import {
  homepageAudience,
  homepageFounder,
  homepageGrow,
  homepageHero,
  homepageOfferings,
  homepagePartner,
  homepageSeo,
  homepageValues,
} from "@/lib/pages/home";
import { aboutApproach, aboutAudience, aboutClose, aboutFounder, aboutHero, aboutSeo } from "@/lib/pages/about";
import { bulletList, heading, lexicalRoot, paragraph, paragraphsDoc } from "./lexical";

export type ImportBlock = { blockType: string } & Record<string, unknown>;

export type ImportPage = {
  slug: string;
  title: string;
  layout: ImportBlock[];
  meta: { title: string; description: string };
};

export type PageImportOptions = {
  /** Mirrors src/lib/features.ts agencyEnabled at import time. */
  agencyEnabled?: boolean;
};

const link = (label: string, href: string) => ({ label, href });

/** Only non-empty values, so optional fields stay unset instead of "". */
function optional(values: Record<string, string | undefined>): Record<string, string> {
  return Object.fromEntries(Object.entries(values).filter(([, value]) => Boolean(value))) as Record<string, string>;
}

function homeHero(): ImportBlock {
  return {
    blockType: "hero",
    eyebrow: homepageHero.eyebrow,
    headline: homepageHero.headline,
    text: homepageHero.supporting,
    buttons: [
      { ...link(homepageHero.primaryCtaLabel, homepageHero.primaryCtaHref), style: "primary" },
      { ...link(homepageHero.secondaryCtaLabel, homepageHero.secondaryCtaHref), style: "secondary" },
    ],
    imagePreset: "hero-community",
  };
}

const offeringPresets = ["cohort-spotlight", "mentorship-talk", "event-workshop"] as const;

export function buildHomePage({ agencyEnabled = false }: PageImportOptions = {}): ImportPage {
  const partnerText = agencyEnabled ? `${homepagePartner.body}\n\n${homepagePartner.agencyBody}` : homepagePartner.body;
  const layout: ImportBlock[] = [
    homeHero(),
    {
      blockType: "founder-story",
      heading: homepageFounder.heading,
      name: homepageFounder.name,
      role: homepageFounder.role,
      story: paragraphsDoc(homepageFounder.paragraphs),
      imagePreset: "founder",
      cta: link(homepageFounder.ctaLabel, homepageFounder.ctaHref),
    },
    {
      blockType: "card-grid",
      heading: homepageOfferings.title,
      variant: "program-types",
      cards: homepageOfferings.items.map((item, index) => ({
        ...optional({ meta: item.meta }),
        title: item.title,
        text: item.body,
        ...optional({ audience: item.audience }),
        imagePreset: offeringPresets[index],
        link: link(item.ctaLabel, item.href),
      })),
    },
    {
      blockType: "card-grid",
      heading: homepageAudience.title,
      variant: "audiences",
      cards: homepageAudience.items.map((item) => ({ title: item.title, text: item.body })),
    },
    {
      blockType: "card-grid",
      heading: homepageValues.title,
      variant: "approaches",
      cards: homepageValues.items.map((item) => ({ title: item.title, text: item.body })),
    },
    {
      blockType: "cta-band",
      heading: homepageGrow.kicker,
      text: homepageGrow.body,
      primary: link(homepageGrow.ctaLabel, homepageGrow.ctaHref),
    },
    {
      blockType: "cta-band",
      heading: homepagePartner.title,
      text: partnerText,
      primary: link(homepagePartner.ctaLabel, homepagePartner.ctaHref),
      ...(agencyEnabled ? { secondary: link(homepagePartner.agencyCtaLabel, homepagePartner.agencyCtaHref) } : {}),
    },
  ];
  return {
    slug: "home",
    title: homepageSeo.title,
    layout,
    meta: { title: homepageSeo.title, description: homepageSeo.description },
  };
}

export function buildAboutPage(): ImportPage {
  const layout: ImportBlock[] = [
    {
      blockType: "hero",
      eyebrow: aboutHero.kicker,
      headline: aboutHero.title,
      text: aboutHero.lede,
      buttons: [{ ...link(aboutHero.ctaLabel, aboutHero.ctaHref), style: "primary" }],
      imagePreset: "about-mission",
    },
    {
      blockType: "founder-story",
      eyebrow: aboutFounder.kicker,
      heading: aboutFounder.heading,
      name: aboutFounder.name,
      role: aboutFounder.role,
      story: lexicalRoot([heading("h3", aboutFounder.storyHeading), ...aboutFounder.paragraphs.map(paragraph)]),
      imagePreset: "founder",
    },
    {
      blockType: "card-grid",
      heading: aboutApproach.title,
      variant: "approaches",
      cards: aboutApproach.items.map((item) => ({ title: item.title, text: item.body })),
    },
    {
      blockType: "text-section",
      heading: aboutAudience.title,
      body: lexicalRoot([bulletList(aboutAudience.items)]),
    },
    {
      blockType: "cta-band",
      heading: aboutClose.title,
      text: aboutClose.lede,
      primary: link(aboutClose.ctaLabel, aboutClose.ctaHref),
    },
  ];
  return {
    slug: "about",
    title: aboutSeo.title,
    layout,
    meta: { title: aboutSeo.title, description: aboutSeo.description },
  };
}

export function buildImportPages(options: PageImportOptions = {}): ImportPage[] {
  return [buildHomePage(options), buildAboutPage()];
}
