/**
 * Reads published CMS pages and chrome for the public site. Outside the page
 * editor's environments (production) every helper returns null before Payload
 * is imported, so production never reads the CMS and keeps rendering code.
 */
import { cache } from "react";
import type { Metadata } from "next";
import { agencyEnabled } from "@/lib/features";
import { isPageEditorEnabled } from "@/lib/page-editor";
import { filterBySections, type SectionToggles } from "@/lib/page-blocks/section-visibility";
import { validateHref } from "@/lib/page-blocks/link-validation";
import type { NavItem } from "@/lib/site";

type Doc = Record<string, unknown>;
type Link = { label?: string | null; href?: string | null };

export type CmsPage = {
  slug?: string;
  title?: string;
  layout?: Array<{ id?: string | null; blockType: string } & Record<string, unknown>> | null;
  meta?: { title?: string | null; description?: string | null } | null;
};

export type PublishedChrome = { header: Doc | null; footer: Doc | null };

/** Page loads honor USE_SEED_CONTENT and missing remote DBs like every other CMS read. */
async function payloadOrNull() {
  const { getPayloadClient, shouldUseCms } = await import("@/lib/payload");
  if (!shouldUseCms()) return null;
  return getPayloadClient();
}

export async function getPublishedCmsPage(slug: string): Promise<CmsPage | null> {
  if (!isPageEditorEnabled()) return null;
  try {
    const payload = await payloadOrNull();
    if (!payload) return null;
    const result = await payload.find({
      collection: "pages",
      where: { and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }] },
      draft: false,
      depth: 1,
      limit: 1,
      overrideAccess: true,
    });
    return (result.docs[0] as unknown as CmsPage | undefined) ?? null;
  } catch {
    return null;
  }
}

async function publishedGlobal(slug: "header" | "footer"): Promise<Doc | null> {
  const payload = await payloadOrNull();
  if (!payload) return null;
  const doc = (await payload.findGlobal({ slug, draft: false, depth: 1, overrideAccess: true })) as unknown as Doc;
  return doc?._status === "published" ? doc : null;
}

/** Header and Footer globals, each only when published. Null when neither is. */
export async function getPublishedChrome(): Promise<PublishedChrome | null> {
  if (!isPageEditorEnabled()) return null;
  try {
    const [header, footer] = await Promise.all([publishedGlobal("header").catch(() => null), publishedGlobal("footer").catch(() => null)]);
    return header || footer ? { header, footer } : null;
  } catch {
    return null;
  }
}

/** One lookup per request for the layout and the route. */
export const getCachedPublishedPage = cache((slug: string) => getPublishedCmsPage(slug));
export const getCachedPublishedHome = () => getCachedPublishedPage("home");
export const getCachedPublishedChrome = cache(() => getPublishedChrome());

/** Which source a route renders: the CMS page only when it has at least one block. */
export function chooseSource(page: CmsPage | null | undefined): "cms" | "code" {
  return page && Array.isArray(page.layout) && page.layout.length > 0 ? "cms" : "code";
}

/** Next.js metadata from a CMS page's share settings, else the code page's metadata. */
export function cmsMetadata(page: CmsPage | null | undefined, fallback: Metadata): Metadata {
  const title = page?.meta?.title?.trim();
  const description = page?.meta?.description?.trim();
  if (!title && !description) return fallback;
  return {
    ...fallback,
    ...(title ? { title: { absolute: title } } : {}),
    ...(description ? { description } : {}),
    openGraph: { ...fallback.openGraph, ...(title ? { title } : {}), ...(description ? { description } : {}) } as Metadata["openGraph"],
    twitter: { ...fallback.twitter, ...(title ? { title } : {}), ...(description ? { description } : {}) } as Metadata["twitter"],
  };
}

const usable = (link: Link): link is { label: string; href: string } =>
  Boolean(link.label?.trim()) && Boolean(link.href) && validateHref(link.href) === true;

/** Today's code defaults when no published Header supplies the toggles. */
const defaultSections = (): SectionToggles => ({ showAgency: agencyEnabled, showEvents: true });

export type ChromeProps = {
  navItems?: NavItem[];
  footer?: { blurb?: string; columns: Array<{ heading: string; links: Array<{ label: string; href: string }> }> };
  /** False when the CMS home page replaces the dark code hero. */
  darkHomeHero: boolean;
};

/** Props for the existing Header and Footer. Empty (code defaults) when nothing is published. */
export function chromeProps(chrome: PublishedChrome | null, homeIsCms: boolean): ChromeProps {
  const darkHomeHero = !homeIsCms;
  if (!chrome) return { darkHomeHero };
  const sections = (chrome.header?.sections as SectionToggles | undefined) ?? defaultSections();
  const props: ChromeProps = { darkHomeHero };
  if (chrome.header) {
    props.navItems = filterBySections((chrome.header.navItems as Link[] | undefined)?.filter(usable), sections).map(({ label, href }) => ({
      label: label as string,
      href: href as string,
    }));
  }
  if (chrome.footer) {
    const columns = (chrome.footer.columns as Array<{ heading?: string | null; links?: Link[] | null }> | undefined) ?? [];
    props.footer = {
      blurb: (chrome.footer.blurb as string | undefined) || undefined,
      columns: columns
        .filter((column) => column.heading?.trim())
        .map((column) => ({
          heading: column.heading as string,
          links: filterBySections((column.links ?? []).filter(usable), sections).map(({ label, href }) => ({ label: label as string, href: href as string })),
        })),
    };
  }
  return props;
}
