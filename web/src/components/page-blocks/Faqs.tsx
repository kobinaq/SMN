import { Band } from "@/components/site/kit";

type Props = { heading?: string; items?: Array<{ question?: string; answer?: string }> };

export function FaqsBlock({ heading, items }: Props) {
  if (!items?.length) return null;
  return (
    <Band>
      <div className="max-w-3xl">
        {heading ? <h2 className="font-display display-3 mb-6 text-text-1">{heading}</h2> : null}
        <div className="divide-y divide-edge-subtle border-y border-edge-subtle">
          {items.map((item, i) => (
            <details key={i} className="group py-1">
              <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-4 py-2 font-semibold text-text-1">
                {item.question}
                <span aria-hidden className="text-accent transition group-open:rotate-45">+</span>
              </summary>
              <p className="pb-4 text-base leading-relaxed text-text-2">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </Band>
  );
}
