"use client";

import { Ref, forwardRef, useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { img } from "@/lib/images";
import { cta } from "@/lib/cta";
import { homepageHero } from "@/lib/content";
import { trackEvent } from "@/lib/analytics";

type Direction = "left" | "right";
type Breakpoint = "sm" | "md" | "lg";

type PhotoItem = {
  id: number;
  order: number;
  x: string;
  y: string;
  zIndex: number;
  direction: Direction;
  src: string;
  alt: string;
};

const photos: PhotoItem[] = [
  {
    id: 1,
    order: 0,
    x: "-320px",
    y: "15px",
    zIndex: 50,
    direction: "left",
    src: img.hero1,
    alt: "Member of the Social Marketers Network community",
  },
  {
    id: 2,
    order: 1,
    x: "-160px",
    y: "32px",
    zIndex: 40,
    direction: "left",
    src: img.hero2,
    alt: "Marketer in the SMN community",
  },
  {
    id: 3,
    order: 2,
    x: "0px",
    y: "8px",
    zIndex: 30,
    direction: "right",
    src: img.hero3,
    alt: "Social Marketers Network member",
  },
  {
    id: 4,
    order: 3,
    x: "160px",
    y: "22px",
    zIndex: 20,
    direction: "right",
    src: img.hero4,
    alt: "Professional in the SMN network",
  },
  {
    id: 5,
    order: 4,
    x: "320px",
    y: "44px",
    zIndex: 10,
    direction: "left",
    src: img.hero5,
    alt: "Community member of Social Marketers Network",
  },
];

const spreads: Record<Breakpoint, { x: string; y: string }[]> = {
  sm: [
    { x: "-72px", y: "10px" },
    { x: "-36px", y: "18px" },
    { x: "0px", y: "4px" },
    { x: "36px", y: "14px" },
    { x: "72px", y: "22px" },
  ],
  md: [
    { x: "-140px", y: "12px" },
    { x: "-70px", y: "22px" },
    { x: "0px", y: "6px" },
    { x: "70px", y: "18px" },
    { x: "140px", y: "28px" },
  ],
  lg: [
    { x: "-320px", y: "15px" },
    { x: "-160px", y: "32px" },
    { x: "0px", y: "8px" },
    { x: "160px", y: "22px" },
    { x: "320px", y: "44px" },
  ],
};

function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>("lg");

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setBp("sm");
      else if (w < 1024) setBp("md");
      else setBp("lg");
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  return bp;
}

export function HeroPhotoGallery() {
  const bp = useBreakpoint();

  return (
    <section
      data-hero
      className="grain relative flex min-h-[100dvh] flex-col overflow-hidden bg-near-black pt-[calc(5rem+env(safe-area-inset-top))] md:pt-24"
    >
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 text-center sm:px-6">
        <p
          data-hero-item
          className="text-[10px] font-medium uppercase tracking-[0.28em] text-baby-blue sm:text-[11px] md:text-xs"
        >
          {homepageHero.eyebrow}
        </p>
        <h1
          data-hero-item
          className="font-display mx-auto mt-3 text-[1.55rem] leading-[1.15] tracking-tight text-white sm:mt-4 sm:text-4xl md:text-5xl"
        >
          {homepageHero.lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p
          data-hero-item
          className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:mt-5 md:text-base"
        >
          {homepageHero.body}
        </p>
      </div>

      <div
        className={cn(
          "relative z-10 mb-4 mt-8 w-full overflow-hidden sm:mb-6 sm:mt-10",
          "flex h-[210px] items-center justify-center sm:h-[280px] md:h-[320px] lg:h-[360px]",
        )}
      >
        <div className="relative mx-auto flex w-full max-w-7xl justify-center px-2">
          <div className="relative flex w-full justify-center">
            <div className="relative h-[120px] w-[120px] sm:h-[180px] sm:w-[180px] md:h-[200px] md:w-[200px] lg:h-[220px] lg:w-[220px]">
              {[...photos].reverse().map((photo, reverseIndex) => {
                const index = photos.length - 1 - reverseIndex;
                const spread = spreads[bp][index] || { x: photo.x, y: photo.y };

                return (
                  <div
                    key={photo.id}
                    className="absolute left-0 top-0"
                    style={{
                      zIndex: photo.zIndex,
                      transform: `translate(${spread.x}, ${spread.y})`,
                    }}
                  >
                    <Photo
                      width={220}
                      height={220}
                      src={photo.src}
                      alt={photo.alt}
                      direction={photo.direction}
                      priority={photo.order === 2}
                      enableDrag={bp === "lg"}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div
        data-hero-item
        className="relative z-10 mt-auto flex w-full flex-col items-center px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-10"
      >
        <div className="btn-row-mobile">
          <Button
            href={cta.exploreServices.href}
            className="sm:min-w-[160px]"
            onClick={() => trackEvent("primary_cta_click", { location: "hero" })}
          >
            {cta.exploreServices.label}
          </Button>
          <Button
            href={cta.joinCommunity.href}
            variant="secondary"
            className="sm:min-w-[140px]"
            onClick={() => trackEvent("secondary_cta_click", { location: "hero" })}
          >
            Join the Community
          </Button>
        </div>
      </div>
    </section>
  );
}

function getRandomNumberInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

const MotionImage = motion.create(
  forwardRef(function MotionImage(
    { alt, ...props }: ImageProps,
    ref: Ref<HTMLImageElement>,
  ) {
    return <Image ref={ref} alt={alt} {...props} />;
  }),
);

function Photo({
  src,
  alt,
  className,
  direction,
  priority,
  enableDrag = true,
}: {
  src: string;
  alt: string;
  className?: string;
  direction?: Direction;
  width: number;
  height: number;
  priority?: boolean;
  enableDrag?: boolean;
}) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const randomRotation =
        getRandomNumberInRange(1.5, 4.5) * (direction === "left" ? -1 : 1);
      setRotation(randomRotation);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [direction]);

  return (
    <motion.div
      drag={enableDrag}
      dragConstraints={enableDrag ? { left: 0, right: 0, top: 0, bottom: 0 } : undefined}
      whileTap={enableDrag ? { scale: 1.12, zIndex: 9999 } : undefined}
      whileHover={
        enableDrag
          ? {
              scale: 1.08,
              rotateZ: 2 * (direction === "left" ? -1 : 1),
              zIndex: 9999,
            }
          : undefined
      }
      whileDrag={enableDrag ? { scale: 1.1, zIndex: 9999 } : undefined}
      initial={{ rotate: 0 }}
      animate={{ rotate: rotation }}
      style={{
        perspective: 400,
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        touchAction: enableDrag ? "none" : "pan-y",
      }}
      className={cn(
        className,
        "relative mx-auto h-[110px] w-[110px] shrink-0 sm:h-[160px] sm:w-[160px] md:h-[200px] md:w-[200px] lg:h-[220px] lg:w-[220px]",
        enableDrag && "cursor-grab active:cursor-grabbing",
      )}
      draggable={false}
      tabIndex={enableDrag ? 0 : -1}
    >
      <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-surface sm:rounded-3xl">
        <MotionImage
          className="rounded-2xl object-cover sm:rounded-3xl"
          fill
          src={src}
          alt={alt}
          sizes="(max-width: 640px) 110px, (max-width: 1024px) 200px, 220px"
          priority={priority}
          draggable={false}
        />
        <div className="image-matte rounded-2xl sm:rounded-3xl" />
      </div>
    </motion.div>
  );
}
