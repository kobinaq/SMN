/** Maps today's header and footer (site.ts nav, pages/chrome.ts) onto the Header and Footer globals. */
import {
  footerAgencyLink,
  footerBrand,
  footerColumnHeadings,
  footerExplore,
  footerMore,
  footerPrograms,
} from "@/lib/pages/chrome";
import { nav as codeNav, type NavItem } from "@/lib/site";

type Link = { label: string; href: string };

export type HeaderImport = {
  navItems: Link[];
  sections: { showAgency: boolean; showEvents: boolean };
};

export type FooterImport = {
  blurb: string;
  columns: Array<{ heading: string; links: Link[] }>;
};

const plain = ({ label, href }: Link): Link => ({ label, href });

export type ChromeImportOptions = {
  /** Mirrors src/lib/features.ts agencyEnabled at import time. */
  agencyEnabled?: boolean;
  /** Defaults to the code nav (which already includes Agency only when enabled). */
  nav?: readonly NavItem[];
};

export function buildHeaderGlobal({ agencyEnabled = false, nav = codeNav }: ChromeImportOptions = {}): HeaderImport {
  return {
    navItems: nav.map(plain),
    // Today's footer shows Events unconditionally, so the toggle starts on.
    sections: { showAgency: agencyEnabled, showEvents: true },
  };
}

export function buildFooterGlobal({ agencyEnabled = false }: ChromeImportOptions = {}): FooterImport {
  const explore = agencyEnabled ? [...footerExplore, footerAgencyLink] : [...footerExplore];
  return {
    blurb: footerBrand,
    columns: [
      { heading: footerColumnHeadings.explore, links: explore.map(plain) },
      { heading: footerColumnHeadings.programs, links: footerPrograms.map(plain) },
      { heading: footerColumnHeadings.more, links: footerMore.map(plain) },
    ],
  };
}
