import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getBlogPosts } from "@/lib/blog";
import { getResourceLibrary } from "@/lib/resources";

const staticRoutes = [
  "/",
  "/about",
  "/programs",
  "/programs/cohort",
  "/programs/courses",
  "/apply",
  "/community",
  "/events",
  "/insights",
  "/resources",
  "/stories",
  "/mentorship",
  "/mentorship/become-a-mentor",
  "/employers",
  "/contact",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  const [posts, resources] = await Promise.all([
    getBlogPosts().catch(() => []),
    getResourceLibrary().catch(() => []),
  ]);

  const dynamicRoutes = [
    ...posts.map((post) => `/insights/${post.slug}`),
    ...resources.map((resource) => `/resources/${resource.slug}`),
  ].filter((path) => Boolean(path) && !path.endsWith("/undefined"));

  const priorityFor = (path: string) => {
    if (path === "/") return 1;
    if (path === "/apply" || path === "/programs/cohort") return 0.9;
    if (path.startsWith("/insights/") || path.startsWith("/resources/")) return 0.5;
    return 0.6;
  };

  return [...staticRoutes, ...dynamicRoutes].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" || path === "/apply" ? "weekly" : "monthly",
    priority: priorityFor(path),
  }));
}
