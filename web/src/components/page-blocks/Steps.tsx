import { Band } from "@/components/site/kit";

type Props = { heading?: string; steps?: Array<{ title?: string; text?: string }> };

export function StepsBlock({ heading, steps }: Props) {
  if (!steps?.length) return null;
  return (
    <Band>
      {heading ? <h2 className="font-display display-3 text-text-1">{heading}</h2> : null}
      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, i) => (
          <li key={i} className="rounded-2xl border border-edge-subtle bg-raised p-5">
            <span className="text-sm font-semibold text-accent">Step {i + 1}</span>
            <h3 className="mt-2 font-display text-lg text-text-1">{step.title}</h3>
            {step.text ? <p className="mt-2 text-sm leading-relaxed text-text-2">{step.text}</p> : null}
          </li>
        ))}
      </ol>
    </Band>
  );
}
