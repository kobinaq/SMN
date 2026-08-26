import { MentorApplication } from "@/components/app/MentorApplication";
import { MentorDirectory } from "@/components/app/MentorDirectory";
import { Button } from "@/components/ui/Button";
import { Card, Eyebrow, PageHeader } from "@/components/ui/Surface";
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
      <PageHeader
        eyebrow="Mentors"
        title="Find the right guide"
        description="Browse staff-approved mentors by specialty, then send a focused request. The SMN team reviews introductions to protect everyone's time."
        action={
          <Button href="/mentorship#become-a-mentor" variant="secondary">
            Become a mentor
          </Button>
        }
      />

      {mentors.length ? (
        <MentorDirectory mentors={mentors} />
      ) : (
        <Card className="border-dashed">
          <h2 className="font-display text-xl text-text-1">Mentor profiles are being reviewed</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-2">
            Staff can review mentor applications in Payload and approve them when ready. Approved profiles appear
            here automatically.
          </p>
          <Button href="/mentorship" variant="secondary" className="mt-6">
            How mentorship works
          </Button>
        </Card>
      )}

      <Card as="section">
        <Eyebrow>Give back</Eyebrow>
        <h2 className="mt-2 font-display text-xl text-text-1">Apply to become a mentor</h2>
        <p className="mt-2 mb-6 max-w-2xl text-sm text-text-2">
          Share your experience and specialties. Staff review every application before publishing a profile.
        </p>
        <MentorApplication status={applicationStatus} />
      </Card>
    </div>
  );
}
