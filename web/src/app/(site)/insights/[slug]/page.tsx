import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BlogCard } from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/Button";
import { formatBlogDate, getBlogPost, getBlogPosts, getRelatedPosts } from "@/lib/blog";
import { posts as seedPosts } from "@/lib/content";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return seedPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      images: [{ url: post.cover }],
    },
  };
}

export default async function InsightArticlePage({ params }: Props) {
  const { slug } = await params;
  const all = await getBlogPosts();
  const post = all.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = getRelatedPosts(post, all, 3);

  return (
    <article className="bg-near-black">
      {/* Hero */}
      <header className="border-b border-white/10 pt-[calc(5.5rem+env(safe-area-inset-top))] sm:pt-32">
        <div className="container-wide pb-8 sm:pb-10 md:pb-12">
          <Link
            href="/insights"
            className="inline-flex min-h-10 items-center gap-2 text-sm text-white/50 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            All insights
          </Link>

          <div className="mt-6 max-w-3xl sm:mt-8">
            <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs">
              <span className="rounded-full border border-baby-blue/40 bg-baby-blue/10 px-2.5 py-1 font-medium uppercase tracking-wider text-baby-blue">
                {post.category}
              </span>
              <span className="text-white/35">
                {formatBlogDate(post.date)} · {post.readTime} read
              </span>
            </div>
            <h1 className="mt-4 font-display text-[1.75rem] leading-tight text-white sm:mt-5 sm:text-4xl md:text-5xl lg:text-[3.25rem]">
              {post.title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/55 sm:mt-5 sm:text-base md:text-lg">
              {post.excerpt}
            </p>

            <div className="mt-6 flex items-center gap-3 sm:mt-8">
              <div className="relative h-11 w-11 overflow-hidden rounded-full border border-white/10 sm:h-12 sm:w-12">
                <Image
                  src={post.authorImage}
                  alt={post.author}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{post.author}</p>
                <p className="text-xs text-white/40">{post.authorRole}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container-wide pb-10 sm:pb-14">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl sm:aspect-[21/9] sm:rounded-[1.75rem]">
            <Image
              src={post.cover}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="image-matte" />
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="border-b border-white/10 bg-ink">
        <div className="container-wide grid gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16 lg:py-16">
          <div className="mx-auto w-full max-w-2xl lg:mx-0">
            <div className="space-y-5 text-[15px] leading-[1.75] text-white/75 sm:space-y-6 sm:text-base md:text-lg md:leading-[1.8]">
              {post.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-white/10 pt-8 sm:mt-12">
              <span className="text-xs uppercase tracking-wider text-white/35">Share</span>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${site.url}/insights/${post.slug}`)}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-white/70 transition hover:border-white/30 hover:text-white"
              >
                LinkedIn
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${site.url}/insights/${post.slug}`)}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-white/70 transition hover:border-white/30 hover:text-white"
              >
                X / Twitter
              </a>
            </div>
          </div>

          {/* Sticky sidebar */}
          <aside className="lg:pt-1">
            <div className="space-y-4 lg:sticky lg:top-28">
              <div className="rounded-2xl border border-white/10 bg-surface p-5 sm:p-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                  Written by
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/10">
                    <Image
                      src={post.authorImage}
                      alt={post.author}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-white">{post.author}</p>
                    <p className="text-xs text-white/45">{post.authorRole}</p>
                  </div>
                </div>
                <Button
                  href="/about"
                  variant="secondary"
                  className="mt-5 w-full text-xs sm:text-sm"
                >
                  About the Network
                </Button>
              </div>

              <div className="rounded-2xl border border-white/10 bg-deep-blue p-5 sm:p-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-baby-blue">
                  Keep learning
                </p>
                <p className="mt-3 font-display text-lg text-white sm:text-xl">
                  Join the next cohort
                </p>
                <p className="mt-2 text-sm text-white/65">
                  Strategy, AI, practice, and community. Live on Google Classroom.
                </p>
                <Button href="/apply" className="mt-5 w-full text-xs sm:text-sm">
                  Apply now
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 ? (
        <section className="bg-near-black py-12 sm:py-16 md:py-20">
          <div className="container-wide">
            <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
              <h2 className="font-display text-xl text-white sm:text-2xl md:text-3xl">
                Keep reading
              </h2>
              <Link
                href="/insights"
                className="text-sm text-baby-blue transition hover:text-white"
              >
                All insights
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
