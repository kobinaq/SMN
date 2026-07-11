import { MentorApplication } from "@/components/app/MentorApplication";
import { MentorDirectory } from "@/components/app/MentorDirectory";
import { Button } from "@/components/ui/Button";
import { requireMember } from "@/lib/auth/member";
import { getApprovedMentors, getMentorApplicationStatus } from "@/lib/mentors";

export const metadata = { title: "Mentors" };

export default async function MentorsAppPage() {
  const member = await requireMember("/app/mentors");
  const [mentors, applicationStatus] = await Promise.all([
    getApprovedMentors(),
    getMentorApplicationStatus(member.id),
  ]);

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">Mentors</p>
          <h1 className="mt-3 font-display text-2xl text-white sm:text-3xl">Find the right guide</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">Browse staff-approved mentors by specialty, then send a focused request. The SMN team reviews introductions to protect everyone’s time.</p>
        </div>
        <Button href="/mentorship/become-a-mentor" variant="secondary" className="shrink-0">Become a mentor</Button>
      </div>

      {mentors.length ? <MentorDirectory mentors={mentors} /> : (
        <div className="rounded-2xl border border-dashed border-white/15 bg-surface p-7 sm:p-10">
          <h2 className="font-display text-xl text-white">Mentor profiles are being reviewed</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/50">Staff can review mentor applications in Payload and approve them when ready. Approved profiles appear here automatically.</p>
          <Button href="/mentorship" variant="secondary" className="mt-6">How mentorship works</Button>
        </div>
      )}

      <section className="rounded-2xl border border-white/10 bg-surface p-5 sm:p-7">
        <p className="text-xs uppercase tracking-[0.18em] text-baby-blue">Give back</p>
        <h2 className="mt-2 font-display text-xl text-white">Apply to become a mentor</h2>
        <p className="mb-6 mt-2 max-w-2xl text-sm text-white/50">Share your experience and specialties. Staff review every application before publishing a profile.</p>
        <MentorApplication status={applicationStatus} />
      </section>
    </div>
  );
}