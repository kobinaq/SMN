import type { Metadata, ResolvingMetadata } from "next";
import { withDefaultShareImages } from "@/lib/share-metadata";
import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Band, Checklist, Masthead } from "@/components/site/kit";
import { formatBlogDate, getBlogPosts } from "@/lib/blog";
import {
  resourcesArticles,
  resourcesCategories,
  resourcesHero,
  resourcesSeo,
  resourcesSubscribe,
  resourcesTools,
} from "@/lib/pages/resources-hub";
import { getResourceLibrary } from "@/lib/resources";

export const revalidate = 60;

export function generateMetadata(_props: unknown, parent: ResolvingMetadata): Promise<Metadata> {
  return withDefaultShareImages(metadata, parent);
}

const metadata: Metadata = {
  title: { absolute: resourcesSeo.title },
  description: resourcesSeo.description,
  alternates: { canonical: "/resources" },
  openGraph: { title: resourcesSeo.title, description: resourcesSeo.description, url: "/resources" },
};

export default async function ResourcesPage() {
  const [posts, library] = await Promise.all([
    getBlogPosts().catch(() => []),
    getResourceLibrary().catch(() => []),
  ]);
  const tools = library.filter((item) => Boolean(item.fileUrl));

  return (
    <>
      <Masthead kicker="Resources" title={resourcesHero.title} lede={resourcesHero.lede} />

      <Band>
        <h2 className="font-display display-2 text-text-1">{resourcesCategories.title}</h2>
      </Band>

      <Band id="articles" tone="raised">
        <h2 className="max-w-3xl font-display display-2 text-text-1">{resourcesArticles.title}</h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-text-2">{resourcesArticles.lede}</p>
        <Checklist className="mt-8 max-w-xl" items={resourcesArticles.categories} />
        {posts.length > 0 ? (
          <ul className="mt-12 grid gap-px overflow-hidden border border-edge-subtle bg-edge-subtle md:grid-cols-2">
            {posts.map((post) => (
              <li key={post.slug} className="bg-canvas">
                <Link href={`/resources/${post.slug}`} className="group flex h-full flex-col">
                  {post.cover ? (
                    <div className="relative aspect-[16/10] overflow-hidden bg-inset">
                      <Image
                        src={post.cover}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 50vw, 100vw"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-6">
                    <p className="eyebrow text-accent">{post.category}</p>
                    <h3 className="mt-3 font-display text-xl text-text-1">{post.title}</h3>
                    {post.excerpt ? (
                      <p className="mt-3 text-sm leading-relaxed text-text-2">{post.excerpt}</p>
                    ) : null}
                    <p className="mt-5 text-xs text-text-3">
                      {post.author ? <span>{post.author}</span> : null}
                      {post.author && post.date ? <span> · </span> : null}
                      {post.date ? <time dateTime={post.date}>{formatBlogDate(post.date)}</time> : null}
                    </p>
                    <span className="mt-4 text-sm font-semibold text-accent">Read article</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </Band>

      <Band id="tools">
        <h2 className="max-w-3xl font-display display-2 text-text-1">{resourcesTools.title}</h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-text-2">{resourcesTools.lede}</p>
        {tools.length > 0 ? (
          <ul className="mt-12 grid gap-px overflow-hidden border border-edge-subtle bg-edge-subtle md:grid-cols-2">
            {tools.map((item) => (
              <li key={item.slug} className="bg-raised p-6">
                <p className="eyebrow text-accent">{item.type}</p>
                <h3 className="mt-3 font-display text-xl text-text-1">{item.title}</h3>
                {item.description ? (
                  <p className="mt-3 text-sm leading-relaxed text-text-2">{item.description}</p>
                ) : null}
                <p className="mt-3 text-xs text-text-3">{item.format}</p>
                <Link
                  href={`/resources/${item.slug}`}
                  className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-accent"
                >
                  {item.fileUrl ? "Download" : "View"}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </Band>

      <Band id="subscribe" tone="raised">
        <div className="max-w-xl">
          <h2 className="font-display display-3 text-text-1">{resourcesSubscribe.heading}</h2>
          <p className="mt-4 text-base leading-relaxed text-text-2">{resourcesSubscribe.body}</p>
          <NewsletterForm
            id="resources-newsletter-email"
            className="mt-6"
            buttonLabel={resourcesSubscribe.button}
            successMessage={resourcesSubscribe.success}
            privacy
          />
        </div>
      </Band>
    </>
  );
}
