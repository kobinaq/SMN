type AnyShareImage =
  | string
  | URL
  | {
      url: string | URL;
      width?: string | number;
      height?: string | number;
      alt?: string;
      type?: string;
      secureUrl?: string | URL;
    };

type ParentShareImages = {
  openGraphImages?: ReadonlyArray<AnyShareImage> | undefined;
  twitterImages?: ReadonlyArray<AnyShareImage> | undefined;
};

function normalizeImage(image: AnyShareImage): AnyShareImage {
  if (typeof image === "string" || image instanceof URL) return image;
  return { ...image };
}

/**
 * Social share images for item detail pages.
 *
 * Prefer the item's own image when present. Otherwise forward the parent
 * segment's images (the hashed `(site)/opengraph-image` + `twitter-image`
 * file conventions) so og:image width/height stay 1200x630.
 *
 * Child routes that set `openGraph` without `images` do NOT inherit the
 * parent file-based OG image in Next.js — omit alone is not enough. Never
 * hardcode `/opengraph-image`; that unhashed path 404s in production.
 */
export function itemShareImages(
  imageUrl: string | null | undefined,
  parent: ParentShareImages = {},
): {
  openGraphImages?: AnyShareImage[];
  twitterImages?: AnyShareImage[];
} {
  const url = typeof imageUrl === "string" ? imageUrl.trim() : "";
  if (url) {
    return {
      openGraphImages: [{ url }],
      twitterImages: [url],
    };
  }

  const openGraphImages = parent.openGraphImages?.length
    ? parent.openGraphImages.map(normalizeImage)
    : undefined;
  const twitterImages = parent.twitterImages?.length
    ? parent.twitterImages.map(normalizeImage)
    : undefined;

  return {
    ...(openGraphImages ? { openGraphImages } : {}),
    ...(twitterImages ? { twitterImages } : {}),
  };
}
