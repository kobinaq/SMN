import { RichText } from "@payloadcms/richtext-lexical/react";
import type { RichTextData } from "./types";

export function RichTextBody({ data }: { data: RichTextData }) {
  if (!data) return null;
  return (
    <div className="space-y-4 text-base leading-relaxed text-text-2 [&_a]:text-accent [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-edge [&_blockquote]:pl-4 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-text-1 [&_h3]:text-xl [&_h3]:text-text-1 [&_h4]:text-lg [&_h4]:text-text-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6">
      <RichText data={data} />
    </div>
  );
}
