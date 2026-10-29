import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";
import { getSiteSettings } from "@/lib/cms";
import { site as fallbackSite } from "@/lib/site";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  // Home title stays "Think Social Academy | …" (tagline). Description from Tab 5.
  const description =
    site.description ||
    fallbackSite.description ||
    "Think Social Academy is a social media marketing academy and community focused on thoughtful learning, practical application, and work designed to support brand and business results.";

  return {
    title: {
      absolute: `${site.name} | ${site.tagline}`,
    },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      title: site.name,
      description,
      url: site.url,
      siteName: site.name,
    },
    twitter: {
      card: "summary_large_image",
      title: site.name,
      description,
    },
  };
}

export default function Page() {
  return <HomePage />;
}
