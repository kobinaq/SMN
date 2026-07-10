import {
  courses as fallbackCourses,
  events as fallbackEvents,
  posts as fallbackPosts,
  stories as fallbackStories,
  resources as fallbackResources,
} from "@/lib/content";
import { site as fallbackSite } from "@/lib/site";
import { safePayloadQuery } from "@/lib/payload";

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
      price: (doc.price as string) || "",
      selarUrl: doc.selarUrl as string,
      badge: (doc.badge as string) || null,
      image:
        typeof doc.image === "object" && doc.image && "url" in doc.image && doc.image.url
          ? (doc.image.url as string)
          : "/images/self-paced.jpg",
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
          : "/images/events-rooftop.jpg",
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
    return result.docs.map((doc) => ({
      slug: doc.slug as string,
      title: doc.title as string,
      category: doc.category as string,
      excerpt: doc.excerpt as string,
      date: (doc.publishedAt as string)?.slice(0, 10) || "",
      readTime: (doc.readTime as string) || "5 min",
    }));
  }, fallbackPosts);
}

export async function getStories() {
  return safePayloadQuery(async () => {
    const { getPayloadClient } = await import("@/lib/payload");
    const payload = await getPayloadClient();
    const result = await payload.find({ collection: "stories", limit: 20 });
    if (!result.docs.length) return fallbackStories;
    return result.docs.map((doc) => ({
      name: doc.name as string,
      role: doc.role as string,
      quote: doc.quote as string,
      image:
        typeof doc.image === "object" && doc.image && "url" in doc.image && doc.image.url
          ? (doc.image.url as string)
          : "/images/story-ada.jpg",
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

export async function getSiteSettings() {
  return safePayloadQuery(async () => {
    const { getPayloadClient } = await import("@/lib/payload");
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({ slug: "site-settings" });
    if (!doc?.siteName) return fallbackSite;
    return {
      ...fallbackSite,
      name: (doc.siteName as string) || fallbackSite.name,
      tagline: (doc.tagline as string) || fallbackSite.tagline,
      discordInvite: (doc.discordInvite as string) || fallbackSite.discordInvite,
      email: (doc.opsEmail as string) || fallbackSite.email,
      cohort: {
        ...fallbackSite.cohort,
        ...(doc.cohort as object),
      },
      social: {
        ...fallbackSite.social,
        ...(doc.social as object),
      },
    };
  }, fallbackSite);
}
