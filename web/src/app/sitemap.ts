import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getBlogPosts } from "@/lib/blog";
import { getPublishedOpportunities } from "@/lib/opportunities";
import { getResourceLibrary } from "@/lib/resources";

const staticRoutes = [
  "/",
  "/about",
  "/programs",
  "/programs/cohort",
  "/programs/courses",
  "/simulations",
  "/apply",
  "/careers",
  "/careers/jobs",
  "/careers/internships",
  "/community",
  "/events",
  "/insights",
  "/resources",
  "/resources/templates",
  "/resources/guides",
  "/stories",
  "/mentorship",
  "/mentorship/become-a-mentor",
  "/employers",
  "/employers/request-intern",
  "/employers/post-a-job",
  "/contact",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  const [posts, resources, jobs] = await Promise.all([
    getBlogPosts().catch(() => []),
    getResourceLibrary().catch(() => []),
    getPublishedOpportunities().catch(() => []),
  ]);

  const dynamicRoutes = [
    ...posts.map((post) => `/insights/${post.slug}`),
    ...resources.map((resource) => `/resources/${resource.slug}`),
    ...jobs.map((job) => `/careers/jobs/${job.slug}`),
  ].filter((path) => Boolean(path) && !path.endsWith("/undefined"));

  const priorityFor = (path: string) => {
    if (path === "/") return 1;
    if (path === "/apply" || path === "/programs/cohort") return 0.9;
    if (path.startsWith("/insights/") || path.startsWith("/resources/") || path.startsWith("/careers/jobs/"))
      return 0.5;
    return 0.6;
  };

  return [...staticRoutes, ...dynamicRoutes].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" || path === "/apply" ? "weekly" : "monthly",
    priority: priorityFor(path),
  }));
}
