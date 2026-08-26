import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/content";
import { formatBlogDate } from "@/lib/blog";

export function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/insights/${post.slug}`}
      className="group relative grid overflow-hidden border border-edge-subtle bg-raised transition duration-300 hover:border-accent/35 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-20px_rgba(126,182,255,0.35)] active:translate-y-0 lg:grid-cols-[1.15fr_0.85fr]"
    >
      <div className="relative min-h-[240px] overflow-hidden sm:min-h-[320px] lg:min-h-[420px]">
        <div className="absolute inset-0 transition duration-500 ease-out group-hover:scale-[1.02]">
          <Image
            src={post.cover}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
        </div>
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wider sm:text-xs">
          <span className="rounded-full bg-accent-strong px-2.5 py-1 font-medium text-text-1">
            Featured
          </span>
          <span className="text-accent">{post.category}</span>
        </div>
        <h2 className="mt-4 font-display text-2xl leading-tight text-text-1 transition group-hover:text-accent sm:text-3xl md:text-4xl">
          {post.title}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-text-2 sm:text-base">
          {post.excerpt}
        </p>
        <div className="mt-6 flex items-center gap-3 border-t border-edge-subtle pt-5">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-edge-subtle">
            <Image
              src={post.authorImage}
              alt={post.author}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div className="min-w-0 text-sm">
            <p className="truncate font-medium text-text-1">{post.author}</p>
            <p className="text-xs text-text-3">
              {formatBlogDate(post.date)} · {post.readTime} read
            </p>
          </div>
        </div>
        <span className="mt-6 text-sm font-medium text-accent">
          Read full article →
        </span>
      </div>
    </Link>
  );
}
