import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import { AhrefsAnalytics } from "@/components/analytics/AhrefsAnalytics";
import { normalizeSiteUrl, site } from "@/lib/site";
import "@/app/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

function safeMetadataBase() {
  try {
    return new URL(normalizeSiteUrl(site.url));
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const siteMetadata: Metadata = {
  metadataBase: safeMetadataBase(),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: site.shortName,
  },
  formatDetection: {
    telephone: false,
  },
};

export const siteViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#174ea6",
};

/** Shared document shell for marketing, auth, and member portal (not Payload admin). */
export function SiteDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} h-full`}>
      {/* Analytics belongs inside <body>: a sibling of <body> is invalid nesting,
          and the browser relocating it is one of the documented causes of a
          hydration mismatch. */}
      <body className="min-h-full bg-canvas font-sans text-text-1 antialiased">
        {children}
        <AhrefsAnalytics />
      </body>
    </html>
  );
}
