import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogCategoryNav } from "@/components/blog/BlogCategoryNav";
import { BlogNewsletter } from "@/components/blog/BlogNewsletter";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { getBlogPosts } from "@/lib/blog";
import { seoTitle } from "@/lib/brand";
import { blogCategories } from "@/lib/content";

export const metadata: Metadata = {
  title: seoTitle("Social Media Marketing Tips"),
  description:
    "Practical insights, frameworks and perspectives on social media, marketing strategy, AI, careers and the changing world of work.",
};

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function InsightsPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const all = await getBlogPosts();
  const active =
    category && blogCategories.includes(category as (typeof blogCategories)[number])
      ? category
      : "All";

  const featured =
    all.find((p) => p.featured) ||
    all[0];

  const rest = all.filter((p) => {
    if (featured && p.slug === featured.slug && active === "All") return false;
    if (active === "All") return true;
    return p.category === active;
  });

  const showFeatured = active === "All" && featured;

  return (
    <>
      {/* Blog header */}
      <section className="border-b border-white/10 bg-near-black pt-[calc(5.5rem+env(safe-area-inset-top))] pb-10 sm:pt-32 sm:pb-14 md:pt-36 md:pb-16">
        <div className="container-wide">
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-baby-blue sm:text-xs">
            Insights
          </p>
          <div className="mt-3 flex flex-col gap-6 lg:mt-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="font-display text-[1.85rem] leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                Ideas for marketers navigating what is next.
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-white/60 sm:mt-4 sm:text-base md:text-lg">
                Practical insights, frameworks, and perspectives on social media, marketing
                strategy, AI, careers, and the changing world of work.
              </p>
            </div>
            <p className="text-sm text-white/40">
              {all.length} article{all.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="mt-8 sm:mt-10">
            <Suspense
              fallback={
                <div className="h-10 animate-pulse rounded-full bg-white/5" />
              }
            >
              <BlogCategoryNav />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="bg-ink pb-16 pt-8 sm:pb-24 sm:pt-12 md:pb-28">
        <div className="container-wide space-y-12 sm:space-y-16">
          {showFeatured ? <FeaturedPost post={featured} /> : null}

          {rest.length > 0 ? (
            <div>
              <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
                <h2 className="font-display text-xl text-white sm:text-2xl">
                  {active === "All" ? "Latest articles" : active}
                </h2>
                {active !== "All" ? (
                  <p className="text-sm text-white/40">
                    {rest.length} post{rest.length === 1 ? "" : "s"}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {rest.map((post, i) => (
                  <BlogCard key={post.slug} post={post} priority={i < 3} />
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-surface px-6 py-16 text-center">
              <p className="font-display text-xl text-white">
                {all.length === 0 ? "No articles published yet" : "No articles in this category yet"}
              </p>
              <p className="mt-2 text-sm text-white/50">
                {all.length === 0
                  ? "Insights will appear here when staff publish them."
                  : "Try another filter or check back soon."}
              </p>
            </div>
          )}

          <BlogNewsletter />

          <div className="flex flex-col gap-3 border-t border-white/10 pt-10 sm:flex-row sm:flex-wrap sm:gap-x-6">
            <Link href="/programs/cohort" className="text-sm text-baby-blue transition hover:text-white">
              Social media marketing training
            </Link>
            <Link href="/programs/courses" className="text-sm text-baby-blue transition hover:text-white">
              Self-paced courses
            </Link>
            <Link href="/community" className="text-sm text-baby-blue transition hover:text-white">
              Join the community
            </Link>
            <Link href="/resources" className="text-sm text-baby-blue transition hover:text-white">
              Free resources
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
