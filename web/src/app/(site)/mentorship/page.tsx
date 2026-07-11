import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Mentorship", description: "Community-powered mentorship for modern marketers." };

export default function MentorshipPage() {
  return <><PageHero eyebrow="Mentorship" title="Guidance from people who’ve done the work." description="Get guidance from brand marketers, agency leaders, consultants, founders, and alumni." /><section className="border-t border-white/10 bg-ink py-20"><div className="container-wide grid gap-12 lg:grid-cols-2"><div><h2 className="font-display text-3xl text-white">How it works</h2><ul className="mt-6 space-y-3 text-white/70"><li>· Browse staff-approved mentor profiles</li><li>· Filter by specialty and availability</li><li>· Send a focused request from your member account</li><li>· SMN reviews and coordinates the introduction</li></ul></div><div className="rounded-[2rem] border border-white/10 bg-surface p-6 md:p-8"><h3 className="font-display text-2xl text-white">Find your mentor</h3><p className="mt-3 text-sm leading-relaxed text-white/50">The directory is available to members so requests stay relevant, accountable, and easy to coordinate.</p><div className="btn-row-mobile mt-7"><Button href="/app/mentors">Browse mentors</Button><Button href="/mentorship/become-a-mentor" variant="secondary">Become a mentor</Button></div></div></div></section></>;
}