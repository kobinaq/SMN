import type { Metadata, ResolvingMetadata } from "next";
import { withDefaultShareImages } from "@/lib/share-metadata";
import { ProgramDetail } from "@/components/programs/ProgramBlocks";
import { seoTitle } from "@/lib/brand";
import { workshopProgram } from "@/lib/pages/programs";

export function generateMetadata(_props: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  return withDefaultShareImages(metadata, parent);
}

const metadata: Metadata = {
  title: seoTitle(workshopProgram.title),
  description: workshopProgram.paragraphs[0],
  alternates: { canonical: workshopProgram.href },
  openGraph: { url: workshopProgram.href },
};

export default function OrganisationalTrainingPage() {
  return <ProgramDetail program={workshopProgram} />;
}
