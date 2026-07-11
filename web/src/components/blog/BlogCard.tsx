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
        "group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface transition duration-300 hover:border-baby-blue/35 sm:rounded-[1.75rem]",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 transition duration-500 ease-out group-hover:scale-[1.03]">
          <Image
            src={post.cover}
            alt=""
            fill
            priority={priority}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="image-matte" />
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-near-black/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-baby-blue sm:left-4 sm:top-4">
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-white/40 sm:text-xs">
          <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span>{post.readTime} read</span>
        </div>
        <h3 className="mt-3 font-display text-lg leading-snug text-white transition group-hover:text-baby-blue sm:text-xl">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-white/55">
          {post.excerpt}
        </p>
        <span className="mt-5 text-sm font-medium text-baby-blue">
          Read article →
        </span>
      </div>
    </Link>
  );
}
