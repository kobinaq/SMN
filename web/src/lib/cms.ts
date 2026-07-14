import {
  courses as fallbackCourses,
  events as fallbackEvents,
  posts as fallbackPosts,
  stories as fallbackStories,
  resources as fallbackResources,
} from "@/lib/content";
import { COURSE_FEE_PENDING_LABEL, FEE_PENDING_LABEL, formatGhsLabel } from "@/lib/currency";
import { img } from "@/lib/images";
import { site as fallbackSite, type SiteConfig } from "@/lib/site";
import { safePayloadQuery } from "@/lib/payload";

function pickString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function resolvePublicPrice(raw: string | null | undefined, pendingLabel: string, confirmed?: boolean) {
  const value = (raw || "").trim();
  if (confirmed === false) return pendingLabel;
  if (!value) return pendingLabel;
  if (/250,?000|45,?000|38,?000|42,?000/i.test(value)) return pendingLabel;
  return formatGhsLabel(value) || pendingLabel;
}

export async function getCourses() {
  return safePayloadQuery(async () => {
    const { getPayloadClient } = await import("@/lib/payload");
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "courses",
      limit: 50,
      where: { status: { equals: "published" } },
    });
    if (!result.docs.length) return fallbackCourses;
    return result.docs.map((doc) => ({
      slug: doc.slug as string,
      title: doc.title as string,
      summary: doc.summary as string,
      outcomes: ((doc.outcomes as { item: string }[]) || []).map((o) => o.item),
      duration: (doc.duration as string) || "",
      lessons: (doc.lessons as number) || 0,
      price: resolvePublicPrice(doc.price as string, COURSE_FEE_PENDING_LABEL),
      selarUrl: doc.selarUrl as string,
      badge: (doc.badge as string) || null,
      image:
        typeof doc.image === "object" && doc.image && "url" in doc.image && doc.image.url
          ? (doc.image.url as string)
          : img.default,
    }));
  }, fallbackCourses);
}

export async function getEvents() {
  return safePayloadQuery(async () => {
    const { getPayloadClient } = await import("@/lib/payload");
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "events",
      limit: 50,
      sort: "date",
    });
    if (!result.docs.length) return fallbackEvents;
    return result.docs.map((doc) => ({
      slug: doc.slug as string,
      title: doc.title as string,
      type: doc.type as string,
      date: doc.date as string,
      time: (doc.time as string) || "",
      summary: doc.summary as string,
      registrationUrl: doc.registrationUrl as string,
      image:
        typeof doc.image === "object" && doc.image && "url" in doc.image && doc.image.url
          ? (doc.image.url as string)
          : img.defaultEvent,
    }));
  }, fallbackEvents);
}

export async function getPosts() {
  return safePayloadQuery(async () => {
    const { getPayloadClient } = await import("@/lib/payload");
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "posts",
      limit: 50,
      sort: "-publishedAt",
    });
    if (!result.docs.length) return fallbackPosts;
    return result.docs.map((doc) => {
      const cover =
        typeof doc.cover === "object" && doc.cover && "url" in doc.cover && doc.cover.url
          ? (doc.cover.url as string)
          : undefined;
      return {
        slug: doc.slug as string,
        title: doc.title as string,
        category: doc.category as string,
        excerpt: doc.excerpt as string,
        date: (doc.publishedAt as string)?.slice(0, 10) || "",
        readTime: (doc.readTime as string) || "5 min",
        cover,
      };
    });
  }, fallbackPosts);
}

export async function getStories() {
  return safePayloadQuery(async () => {
    const { getPayloadClient } = await import("@/lib/payload");
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "stories",
      limit: 20,
      where: {
        and: [{ published: { equals: true } }, { permissionConfirmed: { equals: true } }],
      },
    });
    // No seed fallback — unpublished or empty means no public testimonials
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

export async function getResources() {
  return safePayloadQuery(async () => {
    const { getPayloadClient } = await import("@/lib/payload");
    const payload = await getPayloadClient();
    const result = await payload.find({ collection: "resources", limit: 50 });
    if (!result.docs.length) return fallbackResources;
    return result.docs.map((doc) => ({
      slug: doc.slug as string,
      title: doc.title as string,
      type: doc.type as string,
      description: doc.description as string,
    }));
  }, fallbackResources);
}

export async function getSiteSettings(): Promise<SiteConfig> {
  return safePayloadQuery(async () => {
    const { getPayloadClient } = await import("@/lib/payload");
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({ slug: "site-settings" });
    if (!doc?.siteName) return { ...fallbackSite };

    const cohortDoc = (doc.cohort || {}) as Record<string, unknown>;
    const homepageDoc = (doc.homepage || {}) as Record<string, unknown>;
    const socialDoc = (doc.social || {}) as Record<string, unknown>;
    const priceConfirmed = Boolean(cohortDoc.priceConfirmed);
    const priceLabel = resolvePublicPrice(
      cohortDoc.priceLabel as string,
      FEE_PENDING_LABEL,
      priceConfirmed,
    );

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
      // Attach verified stats for homepage consumers via cast-friendly extension
      ...(impactStats.length ? { impactStats } : {}),
    } as SiteConfig & { impactStats?: { label: string; value: string }[] };
  }, { ...fallbackSite });
}

export async function getVerifiedImpactStats() {
  const settings = (await getSiteSettings()) as SiteConfig & {
    impactStats?: { label: string; value: string }[];
  };
  return settings.impactStats ?? [];
}
