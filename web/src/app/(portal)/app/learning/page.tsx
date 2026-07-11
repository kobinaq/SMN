import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { requireMember } from "@/lib/auth/member";
import { site } from "@/lib/site";

export const metadata = {
  title: "Learning",
};

export default async function LearningPage() {
  await requireMember("/app/learning");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">
          Learning
        </p>
        <h1 className="mt-3 font-display text-2xl text-white sm:text-3xl">Your learning home</h1>
        <p className="mt-2 text-sm leading-relaxed text-white/55">
          Cohort Classroom links, Selar course access, and progress checklists ship in the next
          product phase. For now, use the public programs and apply when you are ready.
        </p>
      </div>
      <div className="rounded-2xl border border-dashed border-white/15 bg-surface p-6 sm:p-8">
        <p className="font-display text-lg text-white">Nothing unlocked yet</p>
        <p className="mt-2 text-sm text-white/50">
          Staff will attach enrollments when you join a cohort or complete a purchase. Self-paced
          courses remain on Selar until webhooks are connected.
        </p>
        <div className="btn-row-mobile mt-6">
          <Button href="/programs/cohort">Flagship cohort</Button>
          <Button href="/programs/courses" variant="secondary">
            Self-paced courses
          </Button>
        </div>
      </div>
      <p className="text-sm text-white/40">
        Next intake: {site.cohort.startDate}.{" "}
        <Link href="/apply" className="text-baby-blue hover:text-white">
          Apply →
        </Link>
      </p>
    </div>
  );
}
