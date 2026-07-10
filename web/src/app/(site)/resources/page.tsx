import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { getResources } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Resources",
  description: "Templates, guides, AI prompts, and toolkits for marketers.",
};

export default async function ResourcesPage() {
  const resources = await getResources();
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="A growing library of practical marketing tools."
        description="Templates, guides, AI prompts, checklists, and toolkits. Subscribe to hear when new ones go live."
      />
      <section className="border-t border-white/10 bg-ink pb-24">
        <div className="container-wide grid gap-5 md:grid-cols-2">
          {resources.map((item) => (
            <article
              key={item.slug}
              className="rounded-[1.75rem] border border-white/10 bg-surface p-7"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-baby-blue">{item.type}</p>
              <h2 className="mt-3 font-display text-2xl text-white">{item.title}</h2>
              <p className="mt-3 text-sm text-white/60 leading-relaxed">{item.description}</p>
            </article>
          ))}
        </div>
        <div className="container-wide mt-14 max-w-xl">
          <h3 className="font-display text-2xl text-white">Get new resources by email</h3>
          <div className="mt-5">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
