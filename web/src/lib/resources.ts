import type { ResourceItem } from "@/lib/content";
import { getResources } from "@/lib/cms";

export async function getResourceLibrary(): Promise<ResourceItem[]> {
  return getResources();
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
