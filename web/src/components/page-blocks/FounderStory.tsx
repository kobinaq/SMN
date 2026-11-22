import { Band } from "@/components/site/kit";
import { LinkButton, Picture } from "./helpers";
import { RichTextBody } from "./RichTextBody";
import type { LinkData, MediaRef, RichTextData } from "./types";

type Props = {
  eyebrow?: string;
  heading?: string;
  name?: string;
  role?: string;
  story?: RichTextData;
  image?: MediaRef;
  imagePreset?: string | null;
  quote?: string;
  cta?: LinkData;
};

export function FounderStoryBlock({ eyebrow, heading, name, role, story, image, imagePreset, quote, cta }: Props) {
  if (!heading && !name && !story && !quote) return null;
  return (
    <Band>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div>
          <Picture media={image} preset={imagePreset} className="aspect-[4/5]" />
          {name ? <p className="mt-4 font-display text-lg text-text-1">{name}</p> : null}
          {role ? <p className="text-sm text-text-3">{role}</p> : null}
        </div>
        <div>
          {eyebrow ? <p className="eyebrow mb-4 text-accent">{eyebrow}</p> : null}
          {heading ? <h2 className="font-display display-3 mb-6 text-text-1">{heading}</h2> : null}
          <RichTextBody data={story} />
          {quote ? (
            <blockquote className="mt-8 border-l-2 border-accent pl-5 text-lg leading-relaxed text-text-1">{quote}</blockquote>
          ) : null}
          {cta?.href ? (
            <div className="mt-8">
              <LinkButton link={cta} variant="secondary" />
            </div>
          ) : null}
        </div>
      </div>
    </Band>
  );
}
