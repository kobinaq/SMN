import { ProfileForm } from "@/components/app/ProfileForm";
import { requireMember } from "@/lib/auth/member";

export const metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const member = await requireMember("/app/profile");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">
          Settings
        </p>
        <h1 className="mt-3 font-display text-2xl text-white sm:text-3xl">Your profile</h1>
        <p className="mt-2 text-sm text-white/50">
          This is what mentors and employers will see when portfolio profiles go live. Avatar
          upload lands with R2 media next.
        </p>
        <p className="mt-2 text-xs text-white/35">{member.email}</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-surface p-5 sm:p-6">
        <ProfileForm
          initial={{
            id: member.id,
            name: member.name || "",
            handle: member.handle || "",
            headline: member.headline || "",
            bio: member.bio || "",
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
