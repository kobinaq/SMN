"use client";

import { Ref, forwardRef, useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { motion, type Variants } from "framer-motion";
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
    { x: "-100px", y: "12px" },
    { x: "-50px", y: "22px" },
    { x: "0px", y: "6px" },
    { x: "50px", y: "18px" },
    { x: "100px", y: "28px" },
  ],
  lg: [
    { x: "-140px", y: "15px" },
    { x: "-70px", y: "32px" },
    { x: "0px", y: "8px" },
    { x: "70px", y: "22px" },
    { x: "140px", y: "44px" },
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

export function HeroPhotoGallery({ animationDelay = 0.35 }: { animationDelay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const bp = useBreakpoint();

  useEffect(() => {
    const visibilityTimer = setTimeout(() => setIsVisible(true), animationDelay * 1000);
    const animationTimer = setTimeout(
      () => setIsLoaded(true),
      (animationDelay + 0.4) * 1000,
    );
    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(animationTimer);
    };
  }, [animationDelay]);

  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.08,
      },
    },
  };

  const photoVariants: Variants = {
    hidden: {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
    },
    visible: (custom: { x: string; y: string; order: number }) => ({
      x: custom.x,
      y: custom.y,
      rotate: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: bp === "sm" ? 90 : 70,
        damping: 14,
        mass: 1,
        delay: custom.order * (bp === "sm" ? 0.1 : 0.15),
      },
    }),
  };

  return (
    <section
      data-hero
      className="grain relative flex min-h-[100dvh] flex-col overflow-hidden bg-near-black pt-[calc(5rem+env(safe-area-inset-top))] md:pt-24"
    >
      <div className="container-wide relative z-10 flex flex-1 flex-col justify-center gap-10 py-8 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-12 lg:py-0">
        <div className="max-w-xl">
          <p
            data-hero-item
            className="text-[10px] font-medium uppercase tracking-[0.28em] text-baby-blue sm:text-[11px]"
          >
            {homepageHero.eyebrow}
          </p>
          <h1
            data-hero-item
            className="font-display mt-4 text-[1.7rem] leading-[1.12] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]"
          >
            {homepageHero.lines.map((line) => (
              <span key={line} className="block text-balance">
                {line}
              </span>
            ))}
          </h1>
          <p
            data-hero-item
            className="mt-5 max-w-[42rem] text-sm leading-relaxed text-white/65 sm:mt-6 sm:text-base"
          >
            {homepageHero.body}
          </p>
          <div data-hero-item className="btn-row-mobile mt-7 sm:mt-8">
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

        <div
          className={cn(
            "relative w-full overflow-hidden",
            "flex h-[200px] items-center justify-center sm:h-[260px] lg:h-[380px]",
          )}
        >
          <motion.div
            className="relative mx-auto flex w-full justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div
              className="relative flex w-full justify-center"
              variants={containerVariants}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
            >
              <div className="relative h-[110px] w-[110px] sm:h-[160px] sm:w-[160px] lg:h-[200px] lg:w-[200px]">
                {[...photos].reverse().map((photo, reverseIndex) => {
                  const index = photos.length - 1 - reverseIndex;
                  const spread = spreads[bp][index] || { x: photo.x, y: photo.y };

                  return (
                    <motion.div
                      key={photo.id}
                      className="absolute left-0 top-0"
                      style={{ zIndex: photo.zIndex }}
                      variants={photoVariants}
                      custom={{
                        x: spread.x,
                        y: spread.y,
                        order: photo.order,
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
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
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
        "relative mx-auto h-[110px] w-[110px] shrink-0 sm:h-[160px] sm:w-[160px] lg:h-[200px] lg:w-[200px]",
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
          sizes="(max-width: 640px) 110px, (max-width: 1024px) 160px, 200px"
          priority={priority}
          draggable={false}
        />
        <div className="image-matte rounded-2xl sm:rounded-3xl" />
      </div>
    </motion.div>
  );
}
