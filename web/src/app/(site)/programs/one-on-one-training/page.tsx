import type { Metadata } from "next";
import { ProgramDetail } from "@/components/programs/ProgramBlocks";
import { seoTitle } from "@/lib/brand";
import { oneOnOneProgram } from "@/lib/pages/programs";

export const metadata: Metadata = {
  title: seoTitle(oneOnOneProgram.title),
  description: oneOnOneProgram.paragraphs[0],
  alternates: { canonical: oneOnOneProgram.href },
  openGraph: { url: oneOnOneProgram.href },
};

export default function OneOnOneTrainingPage() {
  return <ProgramDetail program={oneOnOneProgram} />;
}
