import { Button } from "@/components/ui/Button";
import { requireMember } from "@/lib/auth/member";

export const metadata = {
  title: "Opportunities",
};

export default async function OpportunitiesAppPage() {
  await requireMember("/app/opportunities");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">
          Opportunities
        </p>
        <h1 className="mt-3 font-display text-2xl text-white sm:text-3xl">Jobs & gigs board</h1>
        <p className="mt-2 text-sm leading-relaxed text-white/55">
          A moderated opportunities board ships after the mentor directory. Employers can already
          reach the team from the public partners page.
        </p>
      </div>
      <div className="rounded-2xl border border-dashed border-white/15 bg-surface p-6 sm:p-8">
        <p className="font-display text-lg text-white">No listings yet</p>
        <p className="mt-2 text-sm text-white/50">
          When live, you will filter roles and apply with your profile and portfolio.
        </p>
        <div className="btn-row-mobile mt-6">
          <Button href="/employers">For employers</Button>
          <Button href="/app/profile" variant="secondary">
            Strengthen profile
          </Button>
        </div>
      </div>
    </div>
  );
}
