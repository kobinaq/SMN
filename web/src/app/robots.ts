import type { MetadataRoute } from "next";
import { normalizeSiteUrl, site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = normalizeSiteUrl(site.url);
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/app/", "/app", "/staff", "/staff/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
