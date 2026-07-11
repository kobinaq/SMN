import type { BlogPost } from "@/lib/content";
import { posts as seedPosts } from "@/lib/content";
import { getPosts } from "@/lib/cms";
import { img } from "@/lib/images";

export function formatBlogDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Merge CMS list fields with seed bodies/covers when CMS returns thin records */
export async function getBlogPosts(): Promise<BlogPost[]> {
  const fromCms = await getPosts();
  const seedBySlug = Object.fromEntries(seedPosts.map((p) => [p.slug, p]));

  const merged = fromCms.map((p) => {
    const seed = seedBySlug[p.slug];
    return {
      slug: p.slug,
      title: p.title,
      category: p.category,
      excerpt: p.excerpt,
      date: p.date,
      readTime: p.readTime,
      cover: ("cover" in p && p.cover ? p.cover : seed?.cover) || img.defaultPost,
      featured: seed?.featured ?? false,
      author: seed?.author ?? "Arielle Adodo",
      authorRole: seed?.authorRole ?? "Founder & Lead Instructor",
      authorImage: seed?.authorImage ?? img.instructor,
      body: seed?.body ?? [p.excerpt],
    } satisfies BlogPost;
  });

  // Prefer seed list order + extras if CMS returned empty/fallback already seed
  if (merged.length === 0) return seedPosts;

  const slugs = new Set(merged.map((p) => p.slug));
  const extras = seedPosts.filter((p) => !slugs.has(p.slug));
  return [...merged, ...extras].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const all = await getBlogPosts();
  return all.find((p) => p.slug === slug);
}

export function getRelatedPosts(post: BlogPost, all: BlogPost[], limit = 3) {
  const sameCategory = all.filter(
    (p) => p.slug !== post.slug && p.category === post.category,
  );
  const others = all.filter(
    (p) => p.slug !== post.slug && p.category !== post.category,
  );
  return [...sameCategory, ...others].slice(0, limit);
}
