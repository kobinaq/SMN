import type { ResourceItem } from "@/lib/content";
import { resources as seedResources } from "@/lib/content";
import { getResources } from "@/lib/cms";
import { img } from "@/lib/images";

export async function getResourceLibrary(): Promise<ResourceItem[]> {
  const fromCms = await getResources();
  const seedBySlug = Object.fromEntries(seedResources.map((r) => [r.slug, r]));

  const merged = fromCms.map((r) => {
    const seed = seedBySlug[r.slug];
    return {
      slug: r.slug,
      title: r.title,
      type: r.type,
      description: r.description,
      cover: seed?.cover ?? img.default,
      format: seed?.format ?? "Download",
      level: seed?.level ?? "All levels",
      featured: seed?.featured ?? false,
      free: seed?.free ?? true,
      highlights: seed?.highlights ?? [],
      body: seed?.body ?? [r.description],
    } satisfies ResourceItem;
  });

  if (merged.length === 0) return seedResources;

  const slugs = new Set(merged.map((r) => r.slug));
  const extras = seedResources.filter((r) => !slugs.has(r.slug));
  return [...merged, ...extras];
}

export async function getResource(slug: string) {
  const all = await getResourceLibrary();
  return all.find((r) => r.slug === slug);
}

export function getRelatedResources(item: ResourceItem, all: ResourceItem[], limit = 3) {
  const same = all.filter((r) => r.slug !== item.slug && r.type === item.type);
  const rest = all.filter((r) => r.slug !== item.slug && r.type !== item.type);
  return [...same, ...rest].slice(0, limit);
}
