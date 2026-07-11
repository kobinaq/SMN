import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  CalendarDays,
  MessageCircle,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { memberDisplayName, requireMember } from "@/lib/auth/member";
import { site } from "@/lib/site";

export const metadata = {
  title: "Member home",
};

const placeholders = [
  {
    href: "/app/learning",
    icon: BookOpen,
    title: "Learning",
    body: "Cohort status, Classroom links, and course access will live here.",
    cta: "Open learning",
  },
  {
    href: "/app/mentors",
    icon: UserRound,
    title: "Mentors",
    body: "Browse approved mentors by specialty and request focused guidance.",
    cta: "View mentors",
  },
  {
    href: "/app/opportunities",
    icon: Briefcase,
    title: "Opportunities",
    body: "Jobs, gigs, and internships from the Network will show here.",
    cta: "Browse board",
  },
];

export default async function AppHomePage() {
  const member = await requireMember("/app");
  const name = memberDisplayName(member);
  const cohortLabel =
    member.cohortStatus && member.cohortStatus !== "none"
      ? member.cohortStatus
      : "Not in an active cohort";

  return (
    <div className="space-y-10">
      <section>
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">
          Member portal
        </p>
        <h1 className="mt-3 font-display text-2xl text-white sm:text-3xl md:text-4xl">
          Hi, {name}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
          This is your home in the Network. Finish your profile, join WhatsApp, and check
          upcoming events while we roll out mentors, jobs, and learning tools.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-xs text-white/40">
          <span className="rounded-full border border-white/10 bg-surface px-3 py-1.5">
            Cohort · {cohortLabel}
          </span>
          {(member.roles || ["member"]).map((role) => (
            <span
              key={role}
              className="rounded-full border border-white/10 bg-surface px-3 py-1.5 capitalize"
            >
              {role}
            </span>
          ))}
        </div>
        <div className="btn-row-mobile mt-7">
          <Button href="/app/profile">Complete profile</Button>
          <Button href={site.whatsappInvite} target="_blank" rel="noreferrer" variant="secondary">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {placeholders.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-2xl border border-white/10 bg-surface p-5 transition hover:border-baby-blue/35 sm:rounded-[1.5rem] sm:p-6"
          >
            <item.icon className="h-5 w-5 text-baby-blue" strokeWidth={1.75} />
            <h2 className="mt-4 font-display text-lg text-white group-hover:text-baby-blue">
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/50">{item.body}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm text-baby-blue">
              {item.cta}
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 rounded-2xl border border-white/10 bg-ink p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8 sm:p-6">
        <div className="flex gap-4">
          <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-baby-blue" strokeWidth={1.75} />
          <div>
            <h2 className="font-display text-lg text-white">Stay active on the public site</h2>
            <p className="mt-1 text-sm text-white/50">
              Events, resources, and Insights stay on the marketing site while the portal grows.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button href="/events" variant="secondary" className="text-xs">
            Events
          </Button>
          <Button href="/resources" variant="secondary" className="text-xs">
            Resources
          </Button>
          <Button href="/apply" variant="secondary" className="text-xs">
            Apply to cohort
          </Button>
        </div>
      </section>
    </div>
  );
}
