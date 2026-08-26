import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/content";
import { formatBlogDate } from "@/lib/blog";
import { cn } from "@/lib/utils";

export function BlogCard({
  post,
  className,
  priority,
}: {
  post: BlogPost;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/insights/${post.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden border border-edge-subtle bg-raised transition duration-300 hover:border-accent/35 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-18px_rgba(126,182,255,0.35)] active:translate-y-0",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 transition duration-500 ease-out group-hover:scale-[1.03]">
          <Image
            src={post.cover}
            alt={post.title}
            fill
            priority={priority}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-canvas/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-accent sm:left-4 sm:top-4">
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-text-3 sm:text-xs">
          <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span>{post.readTime} read</span>
        </div>
        <h3 className="mt-3 font-display text-lg leading-snug text-text-1 transition group-hover:text-accent sm:text-xl">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-text-2">
          {post.excerpt}
        </p>
        <span className="mt-5 text-sm font-medium text-accent">
          Read article →
        </span>
      </div>
    </Link>
  );
}
