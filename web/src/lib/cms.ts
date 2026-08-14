import { cache } from "react";
import {
  courses as fallbackCourses,
  events as fallbackEvents,
  posts as fallbackPosts,
  stories as fallbackStories,
  resources as fallbackResources,
  type BlogPost,
  type CourseItem,
  type EventItem,
  type ResourceItem,
} from "@/lib/content";
import { COURSE_FEE_PENDING_LABEL, formatGhsLabel } from "@/lib/currency";
import { img } from "@/lib/images";
import { site as fallbackSite, type SiteConfig } from "@/lib/site";
import { loadPublicList, safePayloadQuery } from "@/lib/payload";
import { blogAuthorDefaults, blogBodyFromCms, resolveCohortPrice } from "@/lib/public-content";

function pickString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

/** Upload relations arrive populated as a doc, or as a bare id when depth is 0. */
function uploadUrl(value: unknown): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  const url = (value as { url?: unknown }).url;
  return typeof url === "string" && url.trim() ? url : undefined;
}

function resolveCoursePrice(raw: string | null | undefined) {
  const value = (raw || "").trim();
  if (!value) return COURSE_FEE_PENDING_LABEL;
  if (/250,?000|45,?000|38,?000|42,?000/i.test(value)) return COURSE_FEE_PENDING_LABEL;
  return formatGhsLabel(value) || COURSE_FEE_PENDING_LABEL;
}

export async function getCourses(): Promise<CourseItem[]> {
  return loadPublicList(async () => {
    const { getPayloadClient } = await import("@/lib/payload");
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "courses",
      limit: 50,
      overrideAccess: false,
      where: { status: { in: ["published", "coming-soon"] } },
    });
    return result.docs.map((doc): CourseItem => {
      const record = doc as unknown as Record<string, unknown>;
      return {
        slug: doc.slug as string,
        title: doc.title as string,
        summary: doc.summary as string,
        outcomes: ((doc.outcomes as { item: string }[]) || []).map((o) => o.item),
        duration: (doc.duration as string) || "",
        lessons: (doc.lessons as number) || 0,
        price: resolveCoursePrice(doc.price as string),
        selarUrl: "",
        id: doc.id,
        amount: typeof record.amount === "number" ? record.amount : null,
        currency: (record.currency as string) || "GHS",
        programKey: (record.programKey as string) || "",
        delivery: (record.delivery as string) || "self-paced",
        badge: (doc.badge as string) || null,
        image:
          typeof doc.image === "object" && doc.image && "url" in doc.image && doc.image.url
            ? (doc.image.url as string)
            : img.default,
      };
    });
  }, fallbackCourses);
}

export async function getEvents(): Promise<EventItem[]> {
  return loadPublicList(async () => {
    const { getPayloadClient } = await import("@/lib/payload");
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "events",
      limit: 50,
      sort: "startsAt",
      overrideAccess: false,
      where: { status: { equals: "published" } },
    });
    return result.docs.map((doc): EventItem => {
      const record = doc as unknown as Record<string, unknown>;
      const startsAt = String(record.startsAt || record.date || "");
      const pricing = (record.pricing as string) || "free";
      const amount = typeof record.amount === "number" ? record.amount : null;
      const formatValue = String(record.format || "online");
      const formatLabel =
        formatValue === "onsite" ? "Onsite" : formatValue === "hybrid" ? "Hybrid" : "Online";
      const priceLabel =
        pricing === "paid" && amount
          ? new Intl.NumberFormat("en-GH", { style: "currency", currency: String(record.currency || "GHS") }).format(amount / 100)
          : "Free";
      const bodyHighlights = String(record.body || "")
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean);
      return {
        id: doc.id,
        slug: doc.slug as string,
        title: doc.title as string,
        type: doc.type as string,
        date: startsAt,
        time: (doc.time as string) || "",
        summary: doc.summary as string,
        registrationUrl: `/events/${doc.slug}`,
        image:
          typeof doc.image === "object" && doc.image && "url" in doc.image && doc.image.url
            ? (doc.image.url as string)
            : img.defaultEvent,
        format: (record.venue as string) || formatLabel,
        price: priceLabel,
        host: (record.host as string) || "SMN",
        highlights: bodyHighlights,
        pricing: pricing as "free" | "paid",
        amount,
        currency: String(record.currency || "GHS"),
        capacity: typeof record.capacity === "number" ? record.capacity : null,
        venue: (record.venue as string) || null,
        address: (record.address as string) || null,
        onlineUrl: (record.onlineUrl as string) || null,
        status: String(record.status || "published"),
      };
    });
  }, fallbackEvents);
}

export async function getPosts(): Promise<BlogPost[]> {
  return loadPublicList(async () => {
    const { getPayloadClient } = await import("@/lib/payload");
    const payload = await getPayloadClient();
    const now = new Date().toISOString();
    const result = await payload.find({
      collection: "posts",
      limit: 50,
      sort: "-publishedAt",
      overrideAccess: false,
      where: {
        and: [{ publishedAt: { exists: true } }, { publishedAt: { less_than_equal: now } }],
      },
    });
    const author = blogAuthorDefaults();
    return result.docs.map((doc): BlogPost => {
      const cover =
        typeof doc.cover === "object" && doc.cover && "url" in doc.cover && doc.cover.url
          ? (doc.cover.url as string)
          : img.defaultPost;
      const excerpt = (doc.excerpt as string) || "";
      return {
        slug: doc.slug as string,
        title: doc.title as string,
        category: doc.category as string,
        excerpt,
        date: (doc.publishedAt as string)?.slice(0, 10) || "",
        readTime: (doc.readTime as string) || "5 min",
        cover,
        featured: false,
        body: blogBodyFromCms(doc.content, excerpt),
        ...author,
      };
    });
  }, fallbackPosts);
}

export async function getStories() {
  return loadPublicList(async () => {
    const { getPayloadClient } = await import("@/lib/payload");
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "stories",
      limit: 20,
      overrideAccess: false,
      where: {
        and: [{ published: { equals: true } }, { permissionConfirmed: { equals: true } }],
      },
    });
    return result.docs.map((doc) => ({
      name: doc.name as string,
      role: doc.role as string,
      quote: doc.quote as string,
      programme: (doc.programme as string) || "",
      portfolioUrl: (doc.portfolioUrl as string) || "",
      image:
        typeof doc.image === "object" && doc.image && "url" in doc.image && doc.image.url
          ? (doc.image.url as string)
          : img.defaultStory,
    }));
  }, fallbackStories);
}

export async function getResources(): Promise<ResourceItem[]> {
  return loadPublicList(async () => {
    const { getPayloadClient } = await import("@/lib/payload");
    const payload = await getPayloadClient();
    const result = await payload.find({ collection: "resources", limit: 50, overrideAccess: false });
    return result.docs.map((doc): ResourceItem => ({
      slug: doc.slug as string,
      title: doc.title as string,
      type: doc.type as string,
      description: doc.description as string,
      cover: img.default,
      format: "Download",
      level: "All levels",
      featured: false,
      free: true,
      highlights: [],
      body: [doc.description as string],
      fileUrl: uploadUrl(doc.file),
    }));
  }, fallbackResources);
}

async function loadSiteSettings(): Promise<SiteConfig> {
  const empty: SiteConfig = { ...fallbackSite, impactStats: [] };
  return safePayloadQuery(async () => {
    const { getPayloadClient } = await import("@/lib/payload");
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({ slug: "site-settings", overrideAccess: false });
    if (!doc?.siteName) return empty;

    const cohortDoc = (doc.cohort || {}) as Record<string, unknown>;
    const homepageDoc = (doc.homepage || {}) as Record<string, unknown>;
    const socialDoc = (doc.social || {}) as Record<string, unknown>;
    const priceConfirmed = Boolean(cohortDoc.priceConfirmed);
    const priceLabel = resolveCohortPrice(cohortDoc.priceLabel as string, priceConfirmed);

    const impactStats = Array.isArray(doc.impactStats)
      ? (doc.impactStats as { label?: string; value?: string; verified?: boolean }[])
          .filter((item) => item.verified && item.label && item.value)
          .map((item) => ({ label: String(item.label), value: String(item.value) }))
      : [];

    return {
      ...fallbackSite,
      name: pickString(doc.siteName, fallbackSite.name),
      tagline: pickString(doc.tagline, fallbackSite.tagline),
      description: pickString(doc.description, fallbackSite.description),
      whatsappInvite: pickString(doc.whatsappInvite, fallbackSite.whatsappInvite),
      email: pickString(doc.opsEmail, fallbackSite.email),
      announcementBanner: pickString(doc.announcementBanner, fallbackSite.announcementBanner),
      footerBlurb: pickString(doc.footerBlurb, fallbackSite.footerBlurb),
      impactStats,
      homepage: {
        headline: pickString(homepageDoc.headline, fallbackSite.homepage.headline),
        supportingCopy: pickString(homepageDoc.supportingCopy, fallbackSite.homepage.supportingCopy),
        primaryCtaLabel: pickString(
          homepageDoc.primaryCtaLabel,
          fallbackSite.homepage.primaryCtaLabel,
        ),
        secondaryCtaLabel: pickString(
          homepageDoc.secondaryCtaLabel,
          fallbackSite.homepage.secondaryCtaLabel,
        ),
        secondaryCtaHref: pickString(
          homepageDoc.secondaryCtaHref,
          fallbackSite.homepage.secondaryCtaHref,
        ),
      },
      cohort: {
        ...fallbackSite.cohort,
        name: pickString(cohortDoc.name, fallbackSite.cohort.name),
        startDate: pickString(cohortDoc.startDate, fallbackSite.cohort.startDate),
        applicationDeadline: pickString(
          cohortDoc.applicationDeadline,
          fallbackSite.cohort.applicationDeadline,
        ),
        duration: pickString(cohortDoc.duration, fallbackSite.cohort.duration),
        seats:
          typeof cohortDoc.seats === "number" && cohortDoc.seats > 0
            ? cohortDoc.seats
            : fallbackSite.cohort.seats,
        audience: pickString(cohortDoc.audience, fallbackSite.cohort.audience),
        format: pickString(cohortDoc.format, fallbackSite.cohort.format),
        sessions: pickString(cohortDoc.sessions, fallbackSite.cohort.sessions),
        priceConfirmed,
        priceLabel,
        priceNote: pickString(cohortDoc.priceNote, fallbackSite.cohort.priceNote),
      },
      social: {
        instagram: pickString(socialDoc.instagram, fallbackSite.social.instagram),
        linkedin: pickString(socialDoc.linkedin, fallbackSite.social.linkedin),
        twitter: pickString(socialDoc.twitter, fallbackSite.social.twitter),
      },
    };
  }, empty);
}

export const getSiteSettings = cache(loadSiteSettings);

export async function getVerifiedImpactStats() {
  const settings = await getSiteSettings();
  return settings.impactStats;
}
