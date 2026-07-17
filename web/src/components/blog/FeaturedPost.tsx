import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/content";
import { formatBlogDate } from "@/lib/blog";

export function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/insights/${post.slug}`}
      className="group relative grid overflow-hidden rounded-2xl border border-white/10 bg-surface transition duration-300 hover:border-baby-blue/35 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-20px_rgba(126,182,255,0.35)] active:translate-y-0 sm:rounded-[2rem] lg:grid-cols-[1.15fr_0.85fr]"
    >
      <div className="relative min-h-[240px] overflow-hidden sm:min-h-[320px] lg:min-h-[420px]">
        <div className="absolute inset-0 transition duration-500 ease-out group-hover:scale-[1.02]">
          <Image
            src={post.cover}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
          <div className="image-matte" />
        </div>
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wider sm:text-xs">
          <span className="rounded-full bg-deep-blue px-2.5 py-1 font-medium text-white">
            Featured
          </span>
          <span className="text-baby-blue">{post.category}</span>
        </div>
        <h2 className="mt-4 font-display text-2xl leading-tight text-white transition group-hover:text-baby-blue sm:text-3xl md:text-4xl">
          {post.title}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
          {post.excerpt}
        </p>
        <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/10">
            <Image
              src={post.authorImage}
              alt={post.author}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div className="min-w-0 text-sm">
            <p className="truncate font-medium text-white">{post.author}</p>
            <p className="text-xs text-white/40">
              {formatBlogDate(post.date)} · {post.readTime} read
            </p>
          </div>
        </div>
        <span className="mt-6 text-sm font-medium text-baby-blue">
          Read full article →
        </span>
      </div>
    </Link>
  );
}
