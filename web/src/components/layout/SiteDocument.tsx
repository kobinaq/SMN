import type { Metadata, Viewport } from "next";
import { Inter, League_Spartan } from "next/font/google";
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

export const siteMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Professional Learning Network`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
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
      <body className="min-h-full bg-near-black font-sans text-white antialiased">
        {children}
      </body>
    </html>
  );
}
