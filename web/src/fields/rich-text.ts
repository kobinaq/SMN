import {
  BlockquoteFeature,
  BoldFeature,
  HeadingFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";

/**
 * The only rich text editor page blocks use. Deliberately small: no code,
 * inline code, HTML, embeds, uploads or relationships. Links are custom URLs
 * only (enabledCollections is empty, so no internal document links).
 */
export const restrictedRichText = lexicalEditor({
  features: [
    ParagraphFeature(),
    HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4"] }),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    OrderedListFeature(),
    UnorderedListFeature(),
    LinkFeature({ enabledCollections: [] }),
    BlockquoteFeature(),
  ],
});
