import { Band } from "@/components/site/kit";
import { Picture } from "./helpers";
import { RichTextBody } from "./RichTextBody";
import type { MediaRef, RichTextData } from "./types";

type Props = { heading?: string; name?: string; role?: string; story?: RichTextData; image?: MediaRef; quote?: string };

export function FounderStoryBlock({ heading, name, role, story, image, quote }: Props) {
  if (!heading && !name && !story && !quote) return null;
  return (
    <Band>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div>
          <Picture media={image} className="aspect-[4/5]" />
          {name ? <p className="mt-4 font-display text-lg text-text-1">{name}</p> : null}
          {role ? <p className="text-sm text-text-3">{role}</p> : null}
        </div>
        <div>
          {heading ? <h2 className="font-display display-3 mb-6 text-text-1">{heading}</h2> : null}
          <RichTextBody data={story} />
          {quote ? (
            <blockquote className="mt-8 border-l-2 border-accent pl-5 text-lg leading-relaxed text-text-1">{quote}</blockquote>
          ) : null}
        </div>
      </div>
    </Band>
  );
}
