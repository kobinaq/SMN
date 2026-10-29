import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getBlogPosts } from "@/lib/blog";
import { getEventCalendar } from "@/lib/events";
import { getResourceLibrary } from "@/lib/resources";

const staticRoutes = [
  "/",
  "/about",
  "/academy",
  "/academy/cohort",
  "/academy/courses",
  "/apply",
  "/community",
  "/events",
  "/insights",
  "/resources",
  "/partner",
  "/contact",
  "/privacy",
  "/terms",
];

/** Fixed date for marketing static pages (not stamped as "today" on every request). */
const STATIC_LAST_MODIFIED = new Date("2026-10-01T00:00:00.000Z");

function toLastModified(value?: string | null): Date | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, "");

  const [posts, resources, events] = await Promise.all([
    getBlogPosts().catch(() => []),
    getResourceLibrary().catch(() => []),
    getEventCalendar().catch(() => []),
  ]);

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${base}${path}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: path === "/" || path === "/apply" ? "weekly" : "monthly",
    priority:
      path === "/"
        ? 1
        : path === "/apply" || path === "/academy/cohort" || path === "/academy"
          ? 0.9
          : 0.6,
  }));

  const postEntries: MetadataRoute.Sitemap = posts
    .filter((post) => Boolean(post.slug))
    .map((post) => ({
      url: `${base}/insights/${post.slug}`,
      lastModified: toLastModified(post.updatedAt) ?? toLastModified(post.date) ?? STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.5,
    }));

  const resourceEntries: MetadataRoute.Sitemap = resources
    .filter((resource) => Boolean(resource.slug))
    .map((resource) => ({
      url: `${base}/resources/${resource.slug}`,
      lastModified: toLastModified(resource.updatedAt) ?? STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.5,
    }));

  const eventEntries: MetadataRoute.Sitemap = events
    .filter((event) => Boolean(event.slug))
    .map((event) => ({
      url: `${base}/events/${event.slug}`,
      lastModified:
        toLastModified(event.updatedAt) ?? toLastModified(event.date) ?? STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.5,
    }));

  return [...staticEntries, ...postEntries, ...resourceEntries, ...eventEntries];
}
