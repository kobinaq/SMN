import { ArrowRight, MessageCircle } from "@/components/ui/icons";
import { OnboardingChecklist } from "@/components/app/OnboardingChecklist";
import { Button } from "@/components/ui/Button";
import { Card, Eyebrow } from "@/components/ui/Surface";
import { Chip } from "@/components/ui/Chip";
import { memberDisplayName, requireMember } from "@/lib/auth/member";
import { getMemberContinuity } from "@/lib/member-continuity";
import { site } from "@/lib/site";

export const metadata = {
  title: "Member home",
};

export default async function AppHomePage() {
  const member = await requireMember("/app");
  const name = memberDisplayName(member);
  let continuity: Awaited<ReturnType<typeof getMemberContinuity>>;
  try {
    continuity = await getMemberContinuity(member);
  } catch (error) {
    console.error("[portal-home] continuity failed", error);
    continuity = {
      profile: { percent: 0, missing: ["Update your profile"] },
      primary: {
        key: "complete-profile",
        eyebrow: "Get set up",
        title: "Finish the essentials on your profile",
        detail: "Add a few details so mentors and opportunities fit better.",
        href: "/app/profile",
        cta: "Update profile",
        tone: "primary",
      },
      secondary: [],
      courses: [],
      openMentorshipCount: 0,
      opportunityActivityCount: 0,
      certificateCount: 0,
    };
  }
  const cohortLabel =
    member.cohortStatus && member.cohortStatus !== "none" ? member.cohortStatus : "Not in an active cohort";
  const hasStartedCourse = continuity.courses.some((course) => course.percentage > 0);
  const roles = Array.isArray(member.roles) && member.roles.length ? member.roles : ["member"];
  const onboardingSteps = [
    { key: "profile", label: "Complete essential profile details", href: "/app/profile", done: continuity.profile.percent >= 60 },
    { key: "skills", label: "Add skills and a career goal", href: "/app/profile", done: continuity.profile.percent >= 80 },
    { key: "course", label: "Start or continue your first course", href: "/app/learning/courses", done: hasStartedCourse },
    { key: "mentors", label: "Explore mentorship", href: "/app/mentors", done: Boolean(continuity.openMentorshipCount) },
    { key: "opportunities", label: "Track an opportunity", href: "/app/opportunities", done: continuity.opportunityActivityCount > 0 },
  ];

  const quickLinks = [
    { href: "/app/learning", label: "Learning hub" },
    { href: "/app/mentors", label: "Mentors" },
    { href: "/app/opportunities", label: "Opportunity board" },
  ];

  return (
    <div className="space-y-8">
      <section className="rise">
        <Eyebrow>Member portal</Eyebrow>
        <h1 className="mt-3 font-display text-2xl text-text-1 sm:text-3xl md:text-4xl">Hi, {name}</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-2 sm:text-base">
          Pick up where you left off, finish what matters next, and keep mentorship, opportunities, and credentials
          moving.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Chip tone="neutral">Cohort · {cohortLabel}</Chip>
          <Chip tone={continuity.profile.percent >= 80 ? "ai" : "accent"}>Profile {continuity.profile.percent}%</Chip>
          {roles.map((role) => (
            <Chip key={role} tone="neutral" className="capitalize">
              {role}
            </Chip>
          ))}
        </div>
      </section>

      <OnboardingChecklist steps={onboardingSteps} />

      {continuity.primary ? (
        <Card className="rise border-accent/25 bg-gradient-to-br from-accent-bg to-raised">
          <Eyebrow>{continuity.primary.eyebrow}</Eyebrow>
          <h2 className="mt-2 font-display text-2xl text-text-1 sm:text-3xl">{continuity.primary.title}</h2>
          <p className="mt-2 max-w-2xl text-sm text-text-2">{continuity.primary.detail}</p>
          <div className="btn-row-mobile mt-6">
            <Button href={continuity.primary.href}>{continuity.primary.cta}</Button>
            <Button href={site.whatsappInvite} target="_blank" rel="noreferrer" variant="secondary">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
          </div>
        </Card>
      ) : null}

      {continuity.secondary.length ? (
        <section className="rise-stagger grid gap-3 sm:grid-cols-2">
          {continuity.secondary.map((item, index) => (
            <Card key={item.key} href={item.href} style={{ "--i": index } as React.CSSProperties}>
              <Eyebrow tone="muted">{item.eyebrow}</Eyebrow>
              <h3 className="mt-2 font-display text-lg text-text-1 transition-colors group-hover:text-accent">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-2">{item.detail}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm text-accent">
                {item.cta}
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Card>
          ))}
        </section>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-3">
        {quickLinks.map((link) => (
          <Card key={link.href} href={link.href} padded={false} className="px-4 py-4 text-sm font-medium text-text-2 hover:text-text-1">
            {link.label}
          </Card>
        ))}
      </section>
    </div>
  );
}
