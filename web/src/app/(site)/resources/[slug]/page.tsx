import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "@/components/ui/icons";
import { ResourceDownloadForm } from "@/components/resources/ResourceDownloadForm";
import { ResourceRow } from "@/components/resources/ResourceRow";
import { Button } from "@/components/ui/Button";
import { getRelatedResources, getResource, getResourceLibrary } from "@/lib/resources";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const resources = await getResourceLibrary();
  return resources.map((r) => ({ slug: r.slug }));
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
    <article className="bg-canvas">
      <header className="border-b border-edge-subtle pt-[calc(5.5rem+env(safe-area-inset-top))] sm:pt-32">
        <div className="container-wide pb-8 sm:pb-10">
          <Link
            href="/resources"
            className="inline-flex min-h-10 items-center gap-2 text-sm text-text-3 transition hover:text-text-1"
          >
            <ArrowLeft className="h-4 w-4" />
            All resources
          </Link>

          <div className="mt-6 grid gap-8 lg:mt-8 lg:grid-cols-[1fr_0.95fr] lg:items-start lg:gap-12">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs">
                <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 font-medium uppercase tracking-wider text-accent">
                  {resource.type}
                </span>
                {resource.free ? (
                  <span className="rounded-full bg-ai/15 px-2.5 py-1 font-medium uppercase tracking-wider text-ai">
                    Free
                  </span>
                ) : null}
                <span className="text-text-3">
                  {resource.format} · {resource.level}
                </span>
              </div>
              <h1 className="mt-4 font-display text-[1.75rem] leading-tight text-text-1 sm:mt-5 sm:text-4xl md:text-5xl">
                {resource.title}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-2 sm:mt-5 sm:text-base md:text-lg">
                {resource.description}
              </p>

              {resource.highlights.length > 0 ? (
                <ul className="mt-6 space-y-3 text-sm text-text-2 sm:mt-8">
                  {resource.highlights.map((h) => (
                    <li key={h} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="relative aspect-[16/11] overflow-hidden border border-edge-subtle lg:aspect-[4/3]">
              <Image
                src={resource.cover}
                alt={resource.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="border-b border-edge-subtle bg-raised">
        <div className="container-wide grid gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14 lg:py-16">
          <div className="max-w-2xl space-y-5 text-[15px] leading-[1.75] text-text-2 sm:space-y-6 sm:text-base md:text-lg">
            {resource.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <div className=" border border-edge-subtle bg-raised p-5 sm:p-6">
              <h3 className="font-display text-lg text-text-1">How to use it</h3>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-text-2">
                <li>Download and open the file on desktop if possible.</li>
                <li>Duplicate it for each client or brand.</li>
                <li>Fill the first section fully before you skip ahead.</li>
                <li>Bring questions into the WhatsApp community.</li>
              </ol>
            </div>
          </div>

          <aside className="lg:pt-1">
            <div className="space-y-4 lg:sticky lg:top-28">
              <div className=" border border-edge-subtle bg-raised p-5 sm:p-6">
                <div className="flex items-center gap-2 text-accent">
                  <Download className="h-4 w-4" />
                  <p className="text-[10px] uppercase tracking-[0.2em]">
                    {resource.free ? "Free download" : "Get access"}
                  </p>
                </div>
                <p className="mt-3 font-display text-xl text-text-1">
                  Send it to my email
                </p>
                <p className="mt-2 text-sm text-text-3">
                  Enter your email and we will send <span className="text-text-2">{resource.title}</span>.
                </p>
                <div className="mt-5">
                  <ResourceDownloadForm
                    resourceSlug={resource.slug}
                    resourceTitle={resource.title}
                  />
                </div>
              </div>

              <div className=" border border-edge-subtle bg-accent-strong p-5 sm:p-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-accent">
                  Want more than templates?
                </p>
                <p className="mt-3 font-display text-lg text-text-1">
                  Join the flagship cohort
                </p>
                <p className="mt-2 text-sm text-text-2">
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
        <section className="bg-canvas py-12 sm:py-16 md:py-20">
          <div className="container-wide">
            <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
              <h2 className="font-display text-lg text-text-1 sm:text-xl md:text-2xl">
                More tools
              </h2>
              <Link
                href="/resources"
                className="text-sm text-accent transition hover:text-text-1"
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
