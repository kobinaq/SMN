import { Band } from "@/components/site/kit";
import { RichTextBody } from "./RichTextBody";
import type { RichTextData } from "./types";

export function TextSectionBlock({ heading, body }: { heading?: string; body?: RichTextData }) {
  if (!heading && !body) return null;
  return (
    <Band>
      <div className="max-w-3xl">
        {heading ? <h2 className="font-display display-3 mb-6 text-text-1">{heading}</h2> : null}
        <RichTextBody data={body} />
      </div>
    </Band>
  );
}
