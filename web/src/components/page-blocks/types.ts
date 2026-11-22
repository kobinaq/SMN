/** Loose shapes for block data. Unknown or missing fields are tolerated: a draft can be half filled. */
export type MediaRef = { url?: string | null; alt?: string | null; width?: number | null; height?: number | null } | number | string | null | undefined;
export type LinkData = { label?: string | null; href?: string | null } | null | undefined;
export type RichTextData = Parameters<typeof import("@payloadcms/richtext-lexical/react").RichText>[0]["data"] | null | undefined;

export type PageBlock = { id?: string | null; blockType: string } & Record<string, unknown>;
