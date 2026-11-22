import type { CollectionConfig } from "payload";
import { pageBlocks } from "@/blocks";
import { isPageEditorEnabled, pageEditorAccess } from "@/lib/page-editor";
import { validatePageSlug } from "@/lib/page-blocks/link-validation";
import { pagePreviewUrl, previewBreakpoints } from "@/lib/page-blocks/preview-url";

export const Pages: CollectionConfig = {
  slug: "pages",
  labels: { singular: "Page", plural: "Pages" },
  admin: {
    group: "Website",
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status", "updatedAt"],
    hidden: () => !isPageEditorEnabled(),
    description: "Page editor. Available outside production only.",
    livePreview: {
      url: ({ data }) => pagePreviewUrl((data as { slug?: string } | undefined)?.slug),
      breakpoints: previewBreakpoints,
    },
    preview: (doc) => pagePreviewUrl((doc as { slug?: string } | undefined)?.slug),
  },
  access: {
    admin: pageEditorAccess.admin,
    read: pageEditorAccess.read,
    create: pageEditorAccess.create,
    update: pageEditorAccess.update,
    delete: pageEditorAccess.delete,
    readVersions: pageEditorAccess.readVersions,
  },
  versions: { drafts: { autosave: { interval: 800 } }, maxPerDoc: 50 },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      validate: validatePageSlug,
      admin: { position: "sidebar", description: 'Lowercase, hyphens only. Use "home" for the home page.' },
    },
    { name: "layout", type: "blocks", blocks: pageBlocks },
    {
      name: "meta",
      type: "group",
      label: "Share settings",
      fields: [
        { name: "title", type: "text" },
        { name: "description", type: "textarea" },
        { name: "image", type: "upload", relationTo: "media" },
      ],
    },
  ],
};
