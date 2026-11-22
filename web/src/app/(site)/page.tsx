import type { Metadata, ResolvingMetadata } from "next";
import { withDefaultShareImages } from "@/lib/share-metadata";
import { HomePage } from "@/components/home/HomePage";
import { homepageSeo } from "@/lib/pages/home";

export const revalidate = 60;

export function generateMetadata(_props: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  return withDefaultShareImages(metadata, parent);
}

const metadata: Metadata = {
  title: { absolute: homepageSeo.title },
  description: homepageSeo.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: homepageSeo.title,
    description: homepageSeo.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: homepageSeo.title,
    description: homepageSeo.description,
  },
};

export default function Page() {
  return <HomePage />;
}
