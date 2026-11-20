import type { Metadata } from "next";
import { ProgramDetail } from "@/components/programs/ProgramBlocks";
import { seoTitle } from "@/lib/brand";
import { workshopProgram } from "@/lib/pages/programs";

export const metadata: Metadata = {
  title: seoTitle(workshopProgram.title),
  description: workshopProgram.paragraphs[0],
  alternates: { canonical: workshopProgram.href },
  openGraph: { url: workshopProgram.href },
};

export default function OrganisationalTrainingPage() {
  return <ProgramDetail program={workshopProgram} />;
}
