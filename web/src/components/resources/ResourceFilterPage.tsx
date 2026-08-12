import { CinematicPageHero } from "@/components/layout/CinematicPageHero";
import { EmptyProof } from "@/components/layout/EmptyProof";
import { ResourceRow } from "@/components/resources/ResourceRow";
import { Button } from "@/components/ui/Button";
import { getResourceLibrary } from "@/lib/resources";

export async function ResourceFilterPage({
  type,
  kicker,
  title,
  description,
  image,
  alt,
  emptyTitle,
  emptyBody,
}: {
  type: string;
  kicker: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  emptyTitle: string;
  emptyBody: string;
}) {
  const all = await getResourceLibrary();
  const items = all.filter((resource) => resource.type === type);

  return (
    <>
      <CinematicPageHero
        image={image}
        alt={alt}
        kicker={kicker}
        title={title}
        description={description}
        size="compact"
        actions={
          <Button href="/resources" variant="secondary">
            All resources
          </Button>
        }
      />
      <section className="bg-ink py-12 sm:py-16 md:py-20">
        <div className="container-wide">
          {items.length ? (
            <div className="space-y-2.5">
              {items.map((resource) => (
                <ResourceRow key={resource.slug} resource={resource} />
              ))}
            </div>
          ) : (
            <EmptyProof
              title={emptyTitle}
              body={emptyBody}
              href="/resources"
              label="View all resources"
            />
          )}
        </div>
      </section>
    </>
  );
}
