import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { getPosts } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Insights",
  description: "Strategy, AI, social media, careers, and industry trends.",
};

export default async function InsightsPage() {
  const posts = await getPosts();
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Educational content for modern marketers."
        description="Articles on strategy, AI, social media, careers, and stories from the community."
      />
      <section className="border-t border-white/10 bg-ink pb-24">
        <div className="container-wide grid gap-5">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/insights/${post.slug}`}
              className="rounded-[1.75rem] border border-white/10 bg-surface p-7 transition hover:border-baby-blue/40"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/40">
                <span className="text-baby-blue">{post.category}</span>
                <span>·</span>
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="mt-3 font-display text-2xl text-white md:text-3xl">{post.title}</h2>
              <p className="mt-3 max-w-3xl text-sm text-white/60 leading-relaxed">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
