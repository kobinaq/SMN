import { Band } from "@/components/site/kit";
import { LinkButton, Picture } from "./helpers";
import type { LinkData, MediaRef } from "./types";

type Props = {
  headline?: string;
  text?: string;
  buttons?: Array<LinkData & { style?: "primary" | "secondary" }>;
  image?: MediaRef;
};

export function HeroBlock({ headline, text, buttons, image }: Props) {
  if (!headline) return null;
  return (
    <Band size="lg">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h1 className="font-display display-1 text-text-1">{headline}</h1>
          {text ? <p className="mt-6 max-w-xl text-base leading-relaxed text-text-2 sm:text-lg">{text}</p> : null}
          {buttons?.length ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {buttons.slice(0, 2).map((button, i) => (
                <LinkButton key={i} link={button} variant={button.style === "secondary" ? "secondary" : "primary"} />
              ))}
            </div>
          ) : null}
        </div>
        <Picture media={image} />
      </div>
    </Band>
  );
}
