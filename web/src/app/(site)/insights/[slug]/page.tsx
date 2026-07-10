import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function InsightArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article className="bg-near-black pt-32 pb-24">
      <div className="container-page max-w-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-baby-blue">{post.category}</p>
        <h1 className="mt-4 font-display text-4xl text-white md:text-5xl">{post.title}</h1>
        <p className="mt-4 text-sm text-white/40">
          {post.date} · {post.readTime}
        </p>
        <div className="prose-custom mt-10 space-y-5 text-base leading-relaxed text-white/70">
          <p>{post.excerpt}</p>
          <p>
            At Social Marketers Network, we believe learning continues through community, practice,
            and real work. Strategy matters when marketers understand audiences, solve business
            problems, and measure outcomes, not when they only chase posts.
          </p>
          <p>
            AI can speed up research, drafting, and analysis. Judgment and taste still sit with you.
            The marketers who do well use both.
          </p>
          <p>
            If this lands with you, explore the flagship cohort, join Discord, or browse self-paced
            courses on Selar.
          </p>
        </div>
        <Link href="/insights" className="mt-12 inline-block text-sm text-baby-blue hover:text-white">
          ← All insights
        </Link>
      </div>
    </article>
  );
}
