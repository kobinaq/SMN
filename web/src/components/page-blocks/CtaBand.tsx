import { CtaBand } from "@/components/site/kit";
import { LinkButton, safeHref } from "./helpers";
import type { LinkData } from "./types";

type Props = { heading?: string; text?: string; primary?: LinkData; secondary?: LinkData };

export function CtaBandBlock({ heading, text, primary, secondary }: Props) {
  if (!heading) return null;
  return (
    <CtaBand
      title={heading}
      lede={text}
      actions={
        <>
          <LinkButton link={primary} variant="light" />
          {safeHref(secondary?.href) ? <LinkButton link={secondary} variant="secondary" /> : null}
        </>
      }
    />
  );
}
