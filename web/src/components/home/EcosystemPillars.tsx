import { Band, Sequence } from "@/components/site/kit";
import { ecosystem } from "@/lib/content";

const WORDS = ["Learn", "Practice", "Connect", "Grow"];

/**
 * The four-part promise, on the one inverted band in the page. Flipping to
 * paper here does the work the old morphing-text effect was reaching for —
 * it stops the scroll — without asking the reader to wait for an animation
 * to finish before they can read the words.
 */
export function EcosystemPillars() {
  return (
    <Band tone="light" size="lg" fade>
      <div data-stagger className="grid gap-px overflow-hidden border-y border-edge bg-edge sm:grid-cols-2 lg:grid-cols-4">
        {WORDS.map((word) => (
          <p
            key={word}
            data-stagger-item
            className="bg-canvas px-5 py-8 text-center font-display display-3 text-text-1 sm:py-12"
          >
            {word}
          </p>
        ))}
      </div>

      <Sequence className="mt-4" items={ecosystem.map((item) => ({
        title: item.title,
        body: item.body,
        meta: item.kicker ?? undefined,
      }))} />
    </Band>
  );
}
