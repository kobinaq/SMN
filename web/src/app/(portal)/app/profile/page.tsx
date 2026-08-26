import Link from "next/link";
import { ProfileForm } from "@/components/app/ProfileForm";
import { Card, Eyebrow, PageHeader, ProgressBar } from "@/components/ui/Surface";
import { Chip } from "@/components/ui/Chip";
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
        <PageHeader eyebrow="Settings" title="Your profile" />
        <p className="mt-2 text-sm text-text-2">
          Complete what helps mentors and opportunities fit better. You can use the platform without finishing every
          field.
        </p>
        <p className="mt-2 text-xs text-text-3">{member.email}</p>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Eyebrow tone="muted">Completion</Eyebrow>
            <h2 className="tnum mt-1 font-display text-xl text-text-1">{continuity.profile.percent}%</h2>
          </div>
          <Chip tone={continuity.profile.percent >= 80 ? "ai" : "accent"}>
            {continuity.profile.percent >= 80 ? "Looking good" : "Suggested next"}
          </Chip>
        </div>
        <ProgressBar value={continuity.profile.percent} className="mt-4" label="Profile completion" />
        {continuity.profile.missing.length ? (
          <ul className="mt-4 space-y-1.5 text-sm text-text-2">
            {continuity.profile.missing.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-ai">Essentials look complete.</p>
        )}
        {member.handle ? (
          <p className="mt-4 text-sm">
            <Link href={`/u/${member.handle}`} className="text-accent hover:underline">
              Open public profile preview
            </Link>
          </p>
        ) : null}
      </Card>

      <Card>
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
      </Card>
    </div>
  );
}
