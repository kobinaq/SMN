import { PortfolioManager } from "@/components/app/PortfolioManager";
import { PageHeader } from "@/components/ui/Surface";
import { requireMember } from "@/lib/auth/member";
import { getMemberPortfolios } from "@/lib/portfolios";

export const metadata = { title: "Portfolio" };

export default async function PortfolioPage() {
  const member = await requireMember("/app/portfolio");
  const portfolios = await getMemberPortfolios(member.id);
  const publicPreviewHref = member.handle ? `/u/${member.handle}` : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Portfolio"
        title="Show how you solve problems"
        description={
          <>
            Turn projects into clear case studies. Public work appears at{" "}
            <span className="text-accent">/u/{member.handle || "your-handle"}</span> when your profile and case study
            visibility allow it.
          </>
        }
      />
      {!member.handle ? (
        <div className="rounded-[var(--radius-md)] border border-warn/25 bg-warn-bg px-4 py-3 text-sm text-warn">
          Add a profile handle before sharing your public portfolio.
        </div>
      ) : null}
      <PortfolioManager initial={portfolios} publicPreviewHref={publicPreviewHref} />
    </div>
  );
}
