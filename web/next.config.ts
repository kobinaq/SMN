import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";
import { withPayload } from "@payloadcms/next/withPayload";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const nextConfig: NextConfig = {
  experimental: {
    // This app has several root layouts (marketing, portal, staff, Payload), so
    // there is no single layout Next can compose a 404 from for a URL that
    // matches no route. `global-not-found` is the documented convention for
    // exactly that case; it returns its own complete document.
    globalNotFound: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Next 16 defaults qualities to [75] only; allow sharper marketing renders.
    qualities: [75, 85, 90],
    // Next 16: if localPatterns is set, ONLY these paths work.
    // Must include site assets (/images, /brand), not just Payload media.
    localPatterns: [
      { pathname: "/images/**" },
      { pathname: "/brand/**" },
      { pathname: "/api/media/file/**" },
    ],
  },
  // Payload import-map resolution on production webpack builds
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      ".cjs": [".cts", ".cjs"],
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };
    return webpackConfig;
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  /**
   * Website Structure doc IA + retired routes. permanent: true issues 308.
   * Destinations point at final URLs (no redirect chains).
   */
  async redirects() {
    return [
      // Former SMN / TSA interim paths → current Learn / Grow / Connect IA
      { source: "/academy", destination: "/learn", permanent: true },
      { source: "/academy/:path*", destination: "/learn/:path*", permanent: true },
      { source: "/programs", destination: "/learn", permanent: true },
      { source: "/programs/:path*", destination: "/learn/:path*", permanent: true },
      { source: "/resources", destination: "/grow", permanent: true },
      { source: "/resources/:path*", destination: "/grow/:path*", permanent: true },
      { source: "/community", destination: "/connect", permanent: true },
      { source: "/community/:path*", destination: "/connect/:path*", permanent: true },
      { source: "/learn/cohort", destination: "/learn/social-media-marketing-ai-programme", permanent: true },
      { source: "/employers", destination: "/partner", permanent: true },
      { source: "/employers/post-a-job", destination: "/connect", permanent: true },
      { source: "/employers/request-intern", destination: "/connect", permanent: true },
      { source: "/experience", destination: "/learn#practical-work", permanent: true },
      { source: "/simulations", destination: "/learn#practical-work", permanent: true },
      { source: "/careers", destination: "/connect", permanent: true },
      { source: "/careers/jobs", destination: "/connect", permanent: true },
      { source: "/careers/jobs/:slug", destination: "/connect", permanent: true },
      { source: "/careers/internships", destination: "/connect", permanent: true },
      { source: "/mentorship", destination: "/connect/mentors", permanent: true },
      { source: "/mentorship/become-a-mentor", destination: "/connect/mentors#become-a-mentor", permanent: true },
      { source: "/mentorship/:path*", destination: "/connect/mentors", permanent: true },
      { source: "/stories", destination: "/connect#stories", permanent: true },
      { source: "/grow/templates", destination: "/grow?type=Template", permanent: true },
      { source: "/grow/guides", destination: "/grow?type=Guide", permanent: true },
      { source: "/staff/website/events", destination: "/staff/events", permanent: true },
      { source: "/staff/website/events/new", destination: "/staff/events/new", permanent: true },
      { source: "/staff/website/events/:id", destination: "/staff/events/:id", permanent: true },
    ];
  },

  async headers() {
    // Vercel injects its live-feedback widget into preview deployments only.
    // Without this the widget is blocked and every preview logs a CSP error
    // that looks like an app fault; production stays locked down.
    const preview = process.env.VERCEL_ENV === "preview";
    const previewScripts = preview ? " https://vercel.live" : "";
    const previewFrames = preview ? " https://vercel.live" : "";
    const previewConnect = preview ? " https://vercel.live wss://vercel.live" : "";
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://analytics.ahrefs.com https://static.cloudflareinsights.com${previewScripts}`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      // static.cloudflareinsights.com is Cloudflare's own edge-injected analytics
      // beacon (present whenever the zone is proxied through Cloudflare) — not
      // something this app loads itself, so it needs an explicit CSP allowance.
      `connect-src 'self' https://analytics.ahrefs.com https://api.paystack.co https://checkout.paystack.com https://cloudflareinsights.com${previewConnect}`,
      `frame-src https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://checkout.paystack.com${previewFrames}`,
    ].join("; ");
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
