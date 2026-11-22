import type { Metadata, ResolvingMetadata } from "next";
import { withDefaultShareImages } from "@/lib/share-metadata";
import { HomePage } from "@/components/home/HomePage";
import { RenderBlocks } from "@/components/page-blocks/RenderBlocks";
import { chooseSource, cmsMetadata, getCachedPublishedHome } from "@/lib/cms-pages";
import { homepageSeo } from "@/lib/pages/home";

export const revalidate = 60;

export async function generateMetadata(_props: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  const cms = await getCachedPublishedHome();
  return withDefaultShareImages(chooseSource(cms) === "cms" ? cmsMetadata(cms, metadata) : metadata, parent);
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

export default async function Page() {
  // A published CMS home page wins outside production. Production gets null here and renders code.
  const cms = await getCachedPublishedHome();
  if (chooseSource(cms) === "cms") return <RenderBlocks blocks={cms?.layout} />;
  return <HomePage />;
}
