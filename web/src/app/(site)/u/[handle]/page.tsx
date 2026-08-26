/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { ExternalLink, MapPin } from "@/components/ui/icons";
import { EmptyProof } from "@/components/layout/EmptyProof";
import { Reveal } from "@/components/motion/Reveal";
import { cta } from "@/lib/cta";
import { getPublicProfile } from "@/lib/portfolios";

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const { member } = await getPublicProfile(handle);
  return {
    title: `${member.name} · Portfolio`,
    description: member.bio || member.headline,
    alternates: { canonical: `/u/${handle}` },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { handle } = await params;
  const { member, portfolios } = await getPublicProfile(handle);

  return (
    <>
      <header className="border-b border-edge-subtle bg-canvas pt-[calc(5.5rem+env(safe-area-inset-top))] sm:pt-28">
        <div className="container-wide pb-12 sm:pb-16">
          <Reveal>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              {member.avatarUrl ? (
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="h-24 w-24 object-cover sm:h-28 sm:w-28"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center bg-accent-strong font-display text-3xl text-text-1 sm:h-28 sm:w-28">
                  {member.name.slice(0, 1)}
                </div>
              )}
              <div>
                <p className="font-display text-sm tracking-[0.08em] text-accent">SMN member</p>
                <h1 className="mt-2 font-display text-4xl text-text-1 sm:text-5xl md:text-6xl">
                  {member.name}
                </h1>
                {member.headline ? (
                  <p className="mt-2 max-w-2xl text-base text-text-2 sm:text-lg">{member.headline}</p>
                ) : null}
                {member.location ? (
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-text-3">
                    <MapPin className="h-4 w-4" />
                    {member.location}
                  </p>
                ) : null}
              </div>
            </div>
            {member.bio ? (
              <p className="mt-8 max-w-3xl text-sm leading-relaxed text-text-2 sm:text-base sm:leading-8">
                {member.bio}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-4">
              {member.linkedin ? (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-accent transition hover:text-text-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  LinkedIn
                </a>
              ) : null}
              {member.portfolioUrl ? (
                <a
                  href={member.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-accent transition hover:text-text-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  Website
                </a>
              ) : null}
            </div>
          </Reveal>
        </div>
      </header>

      <section className="bg-raised py-12 sm:py-16 md:py-20">
        <div className="container-wide">
          <h2 className="font-display display-3 text-text-1">Selected work</h2>
          {portfolios.length ? (
            <div className="mt-8 space-y-8">
              {portfolios.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden border border-edge-subtle bg-raised"
                >
                  {item.coverUrl ? (
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="max-h-[460px] w-full object-cover"
                    />
                  ) : null}
                  <div className="p-6 sm:p-10">
                    <h3 className="font-display display-3 text-text-1">{item.title}</h3>
                    {item.summary ? (
                      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-2 sm:text-base">
                        {item.summary}
                      </p>
                    ) : null}
                    <div className="mt-8 space-y-7 border-t border-edge-subtle pt-8">
                      <div>
                        <h4 className="eyebrow text-accent">
                          Challenge
                        </h4>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-2">
                          {item.challenge}
                        </p>
                      </div>
                      <div>
                        <h4 className="eyebrow text-accent">
                          Approach
                        </h4>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-2">
                          {item.approach}
                        </p>
                      </div>
                      <div>
                        <h4 className="eyebrow text-accent">
                          Outcome
                        </h4>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-2">
                          {item.outcome}
                        </p>
                      </div>
                    </div>
                    {item.skills.length ? (
                      <div className="mt-7 flex flex-wrap gap-2">
                        {item.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-edge-subtle px-3 py-1 text-xs text-text-3"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {item.projectUrl ? (
                      <a
                        href={item.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-7 inline-flex items-center gap-2 text-sm text-accent transition hover:text-text-1"
                      >
                        View project
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8">
              <EmptyProof
                title="No public case studies yet"
                body="This member has not published selected work. The Academy is where SMN members build proof they can show."
                href={cta.explorePrograms.href}
                label={cta.explorePrograms.label}
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
