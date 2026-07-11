import { Button } from "@/components/ui/Button";
import { requireMember } from "@/lib/auth/member";

export const metadata = {
  title: "Mentors",
};

export default async function MentorsAppPage() {
  await requireMember("/app/mentors");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">
          Mentors
        </p>
        <h1 className="mt-3 font-display text-2xl text-white sm:text-3xl">Mentor directory</h1>
        <p className="mt-2 text-sm leading-relaxed text-white/55">
          Approved mentors, topics, and request flows are the next build after accounts. Until
          then, use the public mentorship page.
        </p>
      </div>
      <div className="rounded-2xl border border-dashed border-white/15 bg-surface p-6 sm:p-8">
        <p className="font-display text-lg text-white">Directory coming soon</p>
        <p className="mt-2 text-sm text-white/50">
          You will browse mentors, filter by specialty, and send requests from here.
        </p>
        <div className="btn-row-mobile mt-6">
          <Button href="/mentorship">Mentorship info</Button>
          <Button href="/mentorship/become-a-mentor" variant="secondary">
            Become a mentor
          </Button>
        </div>
      </div>
    </div>
  );
}
