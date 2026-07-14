import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { OnboardingChecklist } from "@/components/app/OnboardingChecklist";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Feedback";
import { memberDisplayName, requireMember } from "@/lib/auth/member";
import { getMemberContinuity } from "@/lib/member-continuity";
import { site } from "@/lib/site";

export const metadata = {
  title: "Member home",
};

export default async function AppHomePage() {
  const member = await requireMember("/app");
  const name = memberDisplayName(member);
  const continuity = await getMemberContinuity(member);
  const cohortLabel =
    member.cohortStatus && member.cohortStatus !== "none"
      ? member.cohortStatus
      : "Not in an active cohort";
  const hasStartedCourse = continuity.courses.some((course) => course.percentage > 0);
  const onboardingSteps = [
    { key: "profile", label: "Complete essential profile details", href: "/app/profile", done: continuity.profile.percent >= 60 },
    { key: "skills", label: "Add skills and a career goal", href: "/app/profile", done: continuity.profile.percent >= 80 },
    { key: "course", label: "Start or continue your first course", href: "/app/learning/courses", done: hasStartedCourse },
    {
      key: "mentors",
      label: "Explore mentorship",
      href: "/app/mentors",
      done: Boolean(continuity.openMentorshipCount),
    },
    {
      key: "opportunities",
      label: "Track an opportunity",
      href: "/app/opportunities",
      done: continuity.opportunityActivityCount > 0,
    },
  ];

  return (
    <div className="space-y-10">
      <section>
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">Member portal</p>
        <h1 className="mt-3 font-display text-2xl text-white sm:text-3xl md:text-4xl">Hi, {name}</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
          Pick up where you left off, finish what matters next, and keep mentorship, opportunities, and credentials moving.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-xs text-white/40">
          <span className="rounded-full border border-white/10 bg-surface px-3 py-1.5">Cohort · {cohortLabel}</span>
          <StatusBadge label={`Profile ${continuity.profile.percent}%`} tone={continuity.profile.percent >= 80 ? "success" : "info"} />
          {(member.roles || ["member"]).map((role) => (
            <span key={role} className="rounded-full border border-white/10 bg-surface px-3 py-1.5 capitalize">
              {role}
            </span>
          ))}
        </div>
      </section>

      <OnboardingChecklist steps={onboardingSteps} />

      {continuity.primary ? (
        <section className="rounded-2xl border border-baby-blue/30 bg-gradient-to-br from-baby-blue/10 to-surface p-5 sm:p-7">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">{continuity.primary.eyebrow}</p>
          <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">{continuity.primary.title}</h2>
          <p className="mt-2 max-w-2xl text-sm text-white/60">{continuity.primary.detail}</p>
          <div className="btn-row-mobile mt-6">
            <Button href={continuity.primary.href}>{continuity.primary.cta}</Button>
            <Button href={site.whatsappInvite} target="_blank" rel="noreferrer" variant="secondary">
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
          </div>
        </section>
      ) : null}

      {continuity.secondary.length ? (
        <section className="grid gap-4 sm:grid-cols-2">
          {continuity.secondary.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="group rounded-2xl border border-white/10 bg-surface p-5 transition hover:border-baby-blue/35"
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">{item.eyebrow}</p>
              <h3 className="mt-2 font-display text-lg text-white group-hover:text-baby-blue">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">{item.detail}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm text-baby-blue">
                {item.cta}
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </section>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-3">
        <Link href="/app/learning" className="rounded-2xl border border-white/10 bg-ink px-4 py-4 text-sm text-white/70 transition hover:border-baby-blue/30">
          Learning hub
        </Link>
        <Link href="/app/mentors" className="rounded-2xl border border-white/10 bg-ink px-4 py-4 text-sm text-white/70 transition hover:border-baby-blue/30">
          Mentors
        </Link>
        <Link href="/app/opportunities" className="rounded-2xl border border-white/10 bg-ink px-4 py-4 text-sm text-white/70 transition hover:border-baby-blue/30">
          Opportunity board
        </Link>
      </section>
    </div>
  );
}
