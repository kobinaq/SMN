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
   * Retired URLs from the site consolidation. Each of these pages was a
   * filtered view or a form variant of the page it now points at, so the
   * destination carries the same content — permanent, not temporary.
   */
  async redirects() {
    return [
      { source: "/resources/templates", destination: "/resources?type=Template", permanent: true },
      { source: "/resources/guides", destination: "/resources?type=Guide", permanent: true },
      { source: "/careers/internships", destination: "/careers/jobs?type=Internship", permanent: true },
      { source: "/employers/post-a-job", destination: "/employers?request=job", permanent: true },
      { source: "/employers/request-intern", destination: "/employers?request=intern", permanent: true },
      { source: "/mentorship/become-a-mentor", destination: "/mentorship#become-a-mentor", permanent: true },
      { source: "/simulations", destination: "/experience#simulations", permanent: true },
      // Events had two staff surfaces over the same records — an ops list and a
      // "website" editor list. One workspace per event now.
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
      `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://analytics.ahrefs.com${previewScripts}`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      `connect-src 'self' https://analytics.ahrefs.com https://api.paystack.co https://checkout.paystack.com${previewConnect}`,
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
