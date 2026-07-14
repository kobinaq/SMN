import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const routes = [
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
  "/login",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" || path === "/apply" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/apply" || path === "/programs/cohort" ? 0.9 : 0.6,
  }));
}
