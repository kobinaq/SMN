import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/forms/ContactForm";
import { Button } from "@/components/ui/Button";
import {
  Band,
  Checklist,
  CtaBand,
  DefinitionGrid,
  Masthead,
  SectionHead,
} from "@/components/site/kit";
import {
  experienceDeliverables,
  experienceReview,
  seoTitle,
  simulationPractice,
} from "@/lib/brand";
import { cta } from "@/lib/cta";
import { img } from "@/lib/images";

export const metadata: Metadata = {
  title: seoTitle("SMN Experience Programme"),
  description:
    "After Social Media Marketing and AI training, selected SMN participants are matched with brands, agencies, and marketers for internships, projects, and portfolio-building experience. Practice simulations open on a waitlist.",
  alternates: { canonical: "/experience" },
};

const partnerProvides = [
  "Practical exposure to marketing work",
  "Guidance and professional mentorship",
  "A real or simulated brief or project",
  "Opportunities to contribute to appropriate tasks",
  "Feedback on the participant's work",
  "Insight into how marketing works in a professional environment",
];

const participantDoes = [
  "Be professional and reliable",
  "Attend agreed sessions or work hours",
  "Complete assigned tasks",
  "Ask questions and take initiative",
  "Apply their training to real situations",
  "Respect confidentiality",
  "Document their learning and work for their portfolio",
];

const participantLearns = [
  "Understanding a marketing brief",
  "Audience research",
  "Content strategy",
  "Campaign planning",
  "Social media management",
  "Content creation",
  "Community management",
  "PR and communications",
  "Marketing analytics",
  "Reporting",
  "Client and stakeholder communication",
  "Professional workflows",
  "Strategic decision-making",
];

const leavesWith = [
  {
    title: "Practical experience",
    body: "Evidence that they have worked on marketing problems beyond a classroom exercise.",
  },
  {
    title: "Portfolio projects",
    body: "Tangible work they can present to potential employers or clients.",
  },
  {
    title: "Professional feedback",
    body: "An assessment or recommendation from someone working in the industry.",
  },
  {
    title: "Industry exposure",
    body: "A better understanding of how marketing teams, agencies, or brands operate.",
  },
  {
    title: "Professional connections",
    body: "Relationships with experienced marketers and potential employers.",
  },
];

const partnerGains = [
  "Develop emerging marketing talent",
  "Give back to the marketing community",
  "Access potential interns or future employees",
  "Receive additional support on defined projects",
  "Build relationships with emerging marketers",
  "Contribute to closing the gap between marketing education and employment",
];

export default function ExperiencePage() {
  return (
    <>
      <Masthead
        image={img.internPath}
        alt="Two emerging marketers talking in the lounge"
        kicker="SMN Experience Programme"
        title="From training into real marketing work."
        lede="After completing SMN's Social Media Marketing and AI Training Programme, selected participants are matched with marketing professionals, agencies, brands, and organisations based on skills, interests, and career direction."
        actions={
          <>
            <Button href={cta.applyCohort.href}>{cta.applyCohort.shortLabel}</Button>
            <Button href={cta.partner.href} variant="secondary">
              {cta.partner.label}
            </Button>
          </>
        }
        meta="Placements are not guaranteed. Eligible participants are considered on fit, readiness, and partner availability."
      />

      <Band size="lg">
        <SectionHead
          kicker="The shape of it"
          title="Learn. Apply. Build experience."
          lede="The engagement may take the form of an internship, volunteering, mentorship, project-based experience, or job shadowing. SMN remains involved throughout."
        />
      </Band>

      <Band tone="raised" size="lg">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={img.hireConversation}
              alt="A partner conversation about marketing work"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <SectionHead
              align="stacked"
              kicker="Partner side"
              title="What the partner provides"
              lede="Depending on the agreed format, mentors and partners may provide:"
            />
            <Checklist className="mt-8" items={partnerProvides} />
          </div>
        </div>
      </Band>

      <Band size="lg">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display display-3 text-text-1">What the participant does</h2>
            <Checklist className="mt-7" tone="ai" items={participantDoes} />
          </div>
          <div>
            <h2 className="font-display display-3 text-text-1">What they should learn</h2>
            <p className="mt-4 text-sm leading-relaxed text-text-2">
              The experience should expose participants to how marketing works beyond the classroom.
            </p>
            <Checklist className="mt-7" tone="muted" columns={2} items={participantLearns} />
          </div>
        </div>
      </Band>

      <Band tone="light" size="lg">
        <SectionHead
          kicker="Output"
          title="Leave with evidence, not only notes."
          lede="The key objective is tangible experience for a portfolio. Depending on the placement, participants should aim to complete three to five of the following."
        />
        <DefinitionGrid className="mt-12" items={[...experienceDeliverables]} />
      </Band>

      <Band size="lg">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHead align="stacked" kicker="Outcome" title="What the participant leaves with" />
            <DefinitionGrid className="mt-8" columns={2} items={leavesWith} />
          </div>
          <div className="relative aspect-[5/4] overflow-hidden">
            <Image
              src={img.practicePair}
              alt="Two marketers working through a brief"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </Band>

      <Band tone="raised" size="lg">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display display-3 text-text-1">What the partner gains</h2>
            <Checklist className="mt-7" items={partnerGains} />
          </div>
          <div>
            <h2 className="font-display display-3 text-text-1">At the end</h2>
            <p className="mt-4 text-sm leading-relaxed text-text-2">
              SMN conducts a simple Experience Review with both the participant and the partner.
            </p>
            <Checklist className="mt-7" tone="ai" items={[...experienceReview]} />
          </div>
        </div>
      </Band>

      {/* Simulations used to be a page of its own. It is the same idea one step
          earlier — practice before placement — so it lives here now. */}
      <Band id="simulations" size="lg" className="scroll-mt-24">
        <SectionHead
          kicker="Simulations · Waitlist"
          title="Practise before the placement."
          lede="Marketing becomes easier to understand when you have a problem to solve. Simulations let you step into the role of a marketer and work through realistic challenges. The live practice product is not open yet."
        />
        <div className="mt-12 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={img.practicePair}
              alt="Two marketers talking through a practice session"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <h3 className="font-display text-2xl text-text-1">What you will practise</h3>
            <Checklist className="mt-6" columns={2} tone="ai" items={[...simulationPractice]} />
            <p className="mt-8 rule pt-6 text-sm leading-relaxed text-text-3">
              Real marketers rarely receive a perfect brief with every answer provided. Until
              simulations open, the{" "}
              <Link href="/programs/cohort" className="link-wipe text-accent">
                live training programme
              </Link>{" "}
              and{" "}
              <Link href="/programs/courses" className="link-wipe text-accent">
                self-paced courses
              </Link>{" "}
              are the live learning paths.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-12 rule pt-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <h3 className="font-display display-3 text-text-1">Register your interest</h3>
            <p className="mt-4 text-sm leading-relaxed text-text-2">
              No member account required. Tell us which kind of challenge you want first. We follow
              up when a window is ready.
            </p>
          </div>
          <div className="border border-edge-subtle bg-raised p-6 sm:p-8">
            <ContactForm defaultType="Simulation waitlist" />
          </div>
        </div>
      </Band>

      <CtaBand
        kicker="The shared outcome"
        title="Applied learning, professional feedback, evidence of what you can do."
        lede="Not just another marketing course — a marketing problem you actually worked through, with something to show for it."
        actions={
          <>
            <Button href={cta.applyCohort.href} variant="light">
              {cta.applyCohort.label}
            </Button>
            <Button href={cta.partner.href} variant="secondary">
              {cta.partner.label}
            </Button>
          </>
        }
      />
    </>
  );
}
