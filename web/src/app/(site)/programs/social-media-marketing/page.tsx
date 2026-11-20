import type { Metadata } from "next";
import { ProgramDetail } from "@/components/programs/ProgramBlocks";
import { seoTitle } from "@/lib/brand";
import { socialMediaProgram } from "@/lib/pages/programs";

export const metadata: Metadata = {
  title: seoTitle(socialMediaProgram.title),
  description: socialMediaProgram.paragraphs[0],
  alternates: { canonical: socialMediaProgram.href },
  openGraph: { url: socialMediaProgram.href },
};

export default function SocialMediaMarketingPage() {
  return <ProgramDetail program={socialMediaProgram} />;
}
