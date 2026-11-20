import type { Metadata, ResolvingMetadata } from "next";
import { withDefaultShareImages } from "@/lib/share-metadata";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@/components/ui/icons";
import { ResourceDownloadForm } from "@/components/resources/ResourceDownloadForm";
import { formatBlogDate, getBlogPost, getBlogPosts } from "@/lib/blog";
import { seoTitle } from "@/lib/brand";
import { getResource, getResourceLibrary } from "@/lib/resources";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const [posts, resources] = await Promise.all([
    getBlogPosts().catch(() => []),
    getResourceLibrary().catch(() => []),
  ]);
  const slugs = new Set<string>();
  for (const post of posts) slugs.add(post.slug);
  for (const resource of resources) slugs.add(resource.slug);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug).catch(() => undefined);
  if (post) {
    const title = seoTitle(post.title);
    return withDefaultShareImages(
      {
        title,
        description: post.excerpt,
        alternates: { canonical: `/resources/${slug}` },
        openGraph: { title: title.absolute, description: post.excerpt, url: `/resources/${slug}` },
      },
      parent,
    );
  }
  const resource = await getResource(slug).catch(() => undefined);
  if (!resource) return {};
  const title = seoTitle(resource.title);
  return withDefaultShareImages(
    {
      title,
      description: resource.description,
      alternates: { canonical: `/resources/${slug}` },
      openGraph: { title: title.absolute, description: resource.description, url: `/resources/${slug}` },
    },
    parent,
  );
}

export default async function ResourceOrArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug).catch(() => undefined);

  if (post) {
    return (
      <article className="bg-canvas">
        <header className="border-b border-edge-subtle pt-[calc(5.5rem+env(safe-area-inset-top))] sm:pt-32">
          <div className="container-wide pb-10 sm:pb-14">
            <Link
              href="/resources#articles"
              className="inline-flex min-h-11 items-center gap-2 text-sm text-text-3 transition hover:text-text-1"
            >
              <ArrowLeft className="h-4 w-4" />
              All resources
            </Link>
            <p className="mt-8 eyebrow text-accent">{post.category}</p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl text-text-1 sm:text-5xl">{post.title}</h1>
            {post.excerpt ? (
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-2">{post.excerpt}</p>
            ) : null}
            <p className="mt-6 text-sm text-text-3">
              {post.author}
              {post.date ? (
                <>
                  {" "}
                  · <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
                </>
              ) : null}
            </p>
            {post.cover ? (
              <div className="relative mt-8 aspect-[16/9] overflow-hidden">
                <Image src={post.cover} alt="" fill priority className="object-cover" sizes="100vw" />
              </div>
            ) : null}
          </div>
        </header>
        <div className="container-wide max-w-3xl space-y-5 py-12 text-base leading-relaxed text-text-2">
          {post.body.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
      </article>
    );
  }

  const resource = await getResource(slug).catch(() => undefined);
  if (!resource || !resource.fileUrl) notFound();

  return (
    <article className="bg-canvas">
      <header className="border-b border-edge-subtle pt-[calc(5.5rem+env(safe-area-inset-top))] sm:pt-32">
        <div className="container-wide grid gap-10 pb-14 lg:grid-cols-2">
          <div>
            <Link
              href="/resources#tools"
              className="inline-flex min-h-11 items-center gap-2 text-sm text-text-3 transition hover:text-text-1"
            >
              <ArrowLeft className="h-4 w-4" />
              All resources
            </Link>
            <p className="mt-8 eyebrow text-accent">{resource.type}</p>
            <h1 className="mt-4 font-display text-4xl text-text-1 sm:text-5xl">{resource.title}</h1>
            <p className="mt-5 text-base leading-relaxed text-text-2">{resource.description}</p>
            <p className="mt-4 text-sm text-text-3">{resource.format}</p>
          </div>
          <ResourceDownloadForm resourceTitle={resource.title} resourceSlug={resource.slug} />
        </div>
      </header>
    </article>
  );
}
