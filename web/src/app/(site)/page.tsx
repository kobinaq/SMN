import type { Metadata } from "next";
import { HomePage } from "@/components/home/HomePage";
import { getSiteSettings } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return {
    title: {
      absolute: `${site.name} | Professional Learning Network`,
    },
    description: site.description,
    alternates: { canonical: "/" },
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
  };
}

export default function Page() {
  return <HomePage />;
}
