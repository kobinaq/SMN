import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { ResourceDownloadForm } from "@/components/resources/ResourceDownloadForm";
import { ResourceRow } from "@/components/resources/ResourceRow";
import { Button } from "@/components/ui/Button";
import { resources as seedResources } from "@/lib/content";
import { getRelatedResources, getResource, getResourceLibrary } from "@/lib/resources";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return seedResources.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getResource(slug);
  if (!resource) return {};
  const canonical = `/resources/${slug}`;
  return {
    title: resource.title,
    description: resource.description,
    alternates: { canonical },
    openGraph: {
      title: resource.title,
      description: resource.description,
      url: canonical,
      images: [{ url: resource.cover }],
    },
  };
}

export default async function ResourceDetailPage({ params }: Props) {
  const { slug } = await params;
  const all = await getResourceLibrary();
  const resource = all.find((r) => r.slug === slug);
  if (!resource) notFound();

  const related = getRelatedResources(resource, all, 3);

  return (
    <article className="bg-near-black">
      <header className="border-b border-white/10 pt-[calc(5.5rem+env(safe-area-inset-top))] sm:pt-32">
        <div className="container-wide pb-8 sm:pb-10">
          <Link
            href="/resources"
            className="inline-flex min-h-10 items-center gap-2 text-sm text-white/50 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            All resources
          </Link>

          <div className="mt-6 grid gap-8 lg:mt-8 lg:grid-cols-[1fr_0.95fr] lg:items-start lg:gap-12">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs">
                <span className="rounded-full border border-baby-blue/40 bg-baby-blue/10 px-2.5 py-1 font-medium uppercase tracking-wider text-baby-blue">
                  {resource.type}
                </span>
                {resource.free ? (
                  <span className="rounded-full bg-mint/15 px-2.5 py-1 font-medium uppercase tracking-wider text-mint">
                    Free
                  </span>
                ) : null}
                <span className="text-white/35">
                  {resource.format} · {resource.level}
                </span>
              </div>
              <h1 className="mt-4 font-display text-[1.75rem] leading-tight text-white sm:mt-5 sm:text-4xl md:text-5xl">
                {resource.title}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:mt-5 sm:text-base md:text-lg">
                {resource.description}
              </p>

              {resource.highlights.length > 0 ? (
                <ul className="mt-6 space-y-3 text-sm text-white/70 sm:mt-8">
                  {resource.highlights.map((h) => (
                    <li key={h} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-baby-blue" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-white/10 sm:rounded-[1.75rem] lg:aspect-[4/3]">
              <Image
                src={resource.cover}
                alt=""
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="image-matte" />
            </div>
          </div>
        </div>
      </header>

      <div className="border-b border-white/10 bg-ink">
        <div className="container-wide grid gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14 lg:py-16">
          <div className="max-w-2xl space-y-5 text-[15px] leading-[1.75] text-white/75 sm:space-y-6 sm:text-base md:text-lg">
            {resource.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <div className="rounded-2xl border border-white/10 bg-surface p-5 sm:p-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">How to use it</p>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-white/70">
                <li>Download and open the file on desktop if possible.</li>
                <li>Duplicate it for each client or brand.</li>
                <li>Fill the first section fully before you skip ahead.</li>
                <li>Bring questions into the WhatsApp community.</li>
              </ol>
            </div>
          </div>

          <aside className="lg:pt-1">
            <div className="space-y-4 lg:sticky lg:top-28">
              <div className="rounded-2xl border border-white/10 bg-surface p-5 sm:p-6">
                <div className="flex items-center gap-2 text-baby-blue">
                  <Download className="h-4 w-4" />
                  <p className="text-[10px] uppercase tracking-[0.2em]">
                    {resource.free ? "Free download" : "Get access"}
                  </p>
                </div>
                <p className="mt-3 font-display text-xl text-white">
                  Send it to my email
                </p>
                <p className="mt-2 text-sm text-white/50">
                  Enter your email and we will send <span className="text-white/80">{resource.title}</span>.
                </p>
                <div className="mt-5">
                  <ResourceDownloadForm
                    resourceSlug={resource.slug}
                    resourceTitle={resource.title}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-deep-blue p-5 sm:p-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-baby-blue">
                  Want more than templates?
                </p>
                <p className="mt-3 font-display text-lg text-white">
                  Join the flagship cohort
                </p>
                <p className="mt-2 text-sm text-white/65">
                  Live strategy, AI workflows, practice, and community.
                </p>
                <Button href="/apply" className="mt-5 w-full text-xs sm:text-sm">
                  Apply now
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="bg-near-black py-12 sm:py-16 md:py-20">
          <div className="container-wide">
            <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
              <h2 className="font-display text-lg text-white sm:text-xl md:text-2xl">
                More tools
              </h2>
              <Link
                href="/resources"
                className="text-sm text-baby-blue transition hover:text-white"
              >
                Full library
              </Link>
            </div>
            <div className="space-y-2.5">
              {related.map((r) => (
                <ResourceRow key={r.slug} resource={r} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
