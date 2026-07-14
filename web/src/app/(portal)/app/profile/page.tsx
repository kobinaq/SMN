import Link from "next/link";
import { ProfileForm } from "@/components/app/ProfileForm";
import { StatusBadge } from "@/components/ui/Feedback";
import { requireMember } from "@/lib/auth/member";
import { getMemberContinuity } from "@/lib/member-continuity";

export const metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const member = await requireMember("/app/profile");
  const continuity = await getMemberContinuity(member);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">Settings</p>
        <h1 className="mt-3 font-display text-2xl text-white sm:text-3xl">Your profile</h1>
        <p className="mt-2 text-sm text-white/50">
          Complete what helps mentors and opportunities fit better. You can use the platform without finishing every field.
        </p>
        <p className="mt-2 text-xs text-white/35">{member.email}</p>
      </div>

      <section className="rounded-2xl border border-white/10 bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">Completion</p>
            <h2 className="mt-1 font-display text-xl text-white">{continuity.profile.percent}%</h2>
          </div>
          <StatusBadge
            label={continuity.profile.percent >= 80 ? "Looking good" : "Suggested next"}
            tone={continuity.profile.percent >= 80 ? "success" : "info"}
          />
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10" aria-hidden>
          <div className="h-full rounded-full bg-baby-blue" style={{ width: `${continuity.profile.percent}%` }} />
        </div>
        {continuity.profile.missing.length ? (
          <ul className="mt-4 space-y-1 text-sm text-white/50">
            {continuity.profile.missing.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-mint">Essentials look complete.</p>
        )}
        {member.handle ? (
          <p className="mt-4 text-sm">
            <Link href={`/u/${member.handle}`} className="text-baby-blue hover:underline">
              Open public profile preview
            </Link>
          </p>
        ) : null}
      </section>

      <div className="rounded-2xl border border-white/10 bg-surface p-5 sm:p-6">
        <ProfileForm
          initial={{
            id: member.id,
            name: member.name || "",
            handle: member.handle || "",
            headline: member.headline || "",
            bio: member.bio || "",
            skills: (member.skills || []).map((item) => item.skill || "").filter(Boolean),
            careerGoals: member.careerGoals || "",
            careerInterests: (member.careerInterests || []).map((item) => item.interest || "").filter(Boolean),
            location: member.location || "",
            linkedin: member.linkedin || "",
            portfolioUrl: member.portfolioUrl || "",
            visibility: member.visibility || "private",
          }}
        />
      </div>
    </div>
  );
}
