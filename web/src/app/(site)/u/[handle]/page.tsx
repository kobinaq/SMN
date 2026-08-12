/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { ExternalLink, MapPin } from "lucide-react";
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
      <header className="border-b border-white/10 bg-near-black pt-[calc(5.5rem+env(safe-area-inset-top))] sm:pt-28">
        <div className="container-wide pb-12 sm:pb-16">
          <Reveal>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              {member.avatarUrl ? (
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="h-24 w-24 rounded-[1.75rem] object-cover sm:h-28 sm:w-28"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-deep-blue font-display text-3xl text-white sm:h-28 sm:w-28">
                  {member.name.slice(0, 1)}
                </div>
              )}
              <div>
                <p className="font-display text-sm tracking-[0.08em] text-baby-blue">SMN member</p>
                <h1 className="mt-2 font-display text-4xl text-white sm:text-5xl md:text-6xl">
                  {member.name}
                </h1>
                {member.headline ? (
                  <p className="mt-2 max-w-2xl text-base text-white/55 sm:text-lg">{member.headline}</p>
                ) : null}
                {member.location ? (
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-white/40">
                    <MapPin className="h-4 w-4" />
                    {member.location}
                  </p>
                ) : null}
              </div>
            </div>
            {member.bio ? (
              <p className="mt-8 max-w-3xl text-sm leading-relaxed text-white/60 sm:text-base sm:leading-8">
                {member.bio}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-4">
              {member.linkedin ? (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-baby-blue transition hover:text-white"
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
                  className="inline-flex items-center gap-2 text-sm text-baby-blue transition hover:text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                  Website
                </a>
              ) : null}
            </div>
          </Reveal>
        </div>
      </header>

      <section className="bg-ink py-12 sm:py-16 md:py-20">
        <div className="container-wide">
          <h2 className="font-display text-2xl text-white sm:text-3xl">Selected work</h2>
          {portfolios.length ? (
            <div className="mt-8 space-y-8">
              {portfolios.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-surface sm:rounded-[2rem]"
                >
                  {item.coverUrl ? (
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="max-h-[460px] w-full object-cover"
                    />
                  ) : null}
                  <div className="p-6 sm:p-10">
                    <h3 className="font-display text-2xl text-white sm:text-3xl">{item.title}</h3>
                    {item.summary ? (
                      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/55 sm:text-base">
                        {item.summary}
                      </p>
                    ) : null}
                    <div className="mt-8 space-y-7 border-t border-white/10 pt-8">
                      <div>
                        <h4 className="text-[10px] font-medium uppercase tracking-[0.16em] text-baby-blue">
                          Challenge
                        </h4>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
                          {item.challenge}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-medium uppercase tracking-[0.16em] text-baby-blue">
                          Approach
                        </h4>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
                          {item.approach}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-medium uppercase tracking-[0.16em] text-baby-blue">
                          Outcome
                        </h4>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
                          {item.outcome}
                        </p>
                      </div>
                    </div>
                    {item.skills.length ? (
                      <div className="mt-7 flex flex-wrap gap-2">
                        {item.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/45"
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
                        className="mt-7 inline-flex items-center gap-2 text-sm text-baby-blue transition hover:text-white"
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
