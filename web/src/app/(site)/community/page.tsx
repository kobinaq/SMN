import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Community",
  description: "Join the Social Marketers Network on Discord.",
};

export default function CommunityPage() {
  return (
    <>
      <PageHero
        eyebrow="Community"
        title="The community many marketers wish they had at the start."
        description="Share ideas, ask questions, work with others, and keep learning. Our home base is Discord."
      />
      <section className="border-t border-white/10 bg-ink py-20">
        <div className="container-wide grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem]">
            <Image
              src="/images/community-table.jpg"
              alt="Members collaborating"
              fill
              className="object-cover"
              sizes="50vw"
            />
            <div className="image-matte" />
          </div>
          <div>
            <h2 className="font-display text-3xl text-white">What happens in Discord</h2>
            <ul className="mt-6 space-y-3 text-white/70">
              <li>· Learn together and share what works</li>
              <li>· Get feedback on campaigns and portfolios</li>
              <li>· Find people to work with</li>
              <li>· Hear about opportunities and events</li>
              <li>· Join mentor sessions and office hours</li>
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href={site.discordInvite} target="_blank" rel="noreferrer">
                Join Discord
              </Button>
              <Button href="/apply" variant="secondary">
                Apply to cohort
              </Button>
            </div>
            <p className="mt-6 text-sm text-white/40">
              Cohort members receive additional private channels after acceptance.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
