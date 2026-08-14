import type { BlogPost } from "@/lib/content";
import { getPosts } from "@/lib/cms";

export function formatBlogDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const posts = await getPosts();
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
