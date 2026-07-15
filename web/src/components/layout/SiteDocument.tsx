import type { Metadata, Viewport } from "next";
import { Inter, League_Spartan } from "next/font/google";
import { AhrefsAnalytics } from "@/components/analytics/AhrefsAnalytics";
import { site } from "@/lib/site";
import "@/app/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const leagueSpartan = League_Spartan({
  variable: "--font-league-spartan",
  subsets: ["latin"],
});

function safeMetadataBase() {
  try {
    return new URL(site.url);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const siteMetadata: Metadata = {
  metadataBase: safeMetadataBase(),
  title: {
    default: `${site.name} | Professional Learning Network`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  alternates: {
    canonical: "/",
  },
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
  themeColor: "#0b0d12",
};

/** Shared document shell for marketing, auth, and member portal (not Payload admin). */
export function SiteDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${leagueSpartan.variable} h-full`}>
      <head>
        <AhrefsAnalytics />
      </head>
      <body className="min-h-full bg-near-black font-sans text-white antialiased">{children}</body>
    </html>
  );
}
