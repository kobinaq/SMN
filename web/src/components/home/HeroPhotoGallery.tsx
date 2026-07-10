"use client";

import { Ref, forwardRef, useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";

type Direction = "left" | "right";

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
    src: "/images/hero-student.jpg",
    alt: "Student member of the Social Marketers Network",
  },
  {
    id: 2,
    order: 1,
    x: "-160px",
    y: "32px",
    zIndex: 40,
    direction: "left",
    src: "/images/hero-junior.jpg",
    alt: "Junior social media marketer",
  },
  {
    id: 3,
    order: 2,
    x: "0px",
    y: "8px",
    zIndex: 30,
    direction: "right",
    src: "/images/hero-freelancer.jpg",
    alt: "Freelance marketing professional",
  },
  {
    id: 4,
    order: 3,
    x: "160px",
    y: "22px",
    zIndex: 20,
    direction: "right",
    src: "/images/hero-professional.jpg",
    alt: "Brand marketing professional",
  },
  {
    id: 5,
    order: 4,
    x: "320px",
    y: "44px",
    zIndex: 10,
    direction: "left",
    src: "/images/hero-mentor.jpg",
    alt: "Senior marketing mentor",
  },
];

// Mobile / tablet spreads (tighter)
const photosMd: Omit<PhotoItem, "src" | "alt" | "direction" | "id" | "order" | "zIndex">[] = [
  { x: "-180px", y: "12px" },
  { x: "-90px", y: "24px" },
  { x: "0px", y: "6px" },
  { x: "90px", y: "18px" },
  { x: "180px", y: "30px" },
];

export function HeroPhotoGallery({ animationDelay = 0.35 }: { animationDelay?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isWide, setIsWide] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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
        staggerChildren: 0.15,
        delayChildren: 0.1,
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
        stiffness: 70,
        damping: 12,
        mass: 1,
        delay: custom.order * 0.15,
      },
    }),
  };

  return (
    <section
      data-hero
      className="grain relative flex min-h-[100svh] flex-col overflow-hidden bg-near-black pt-28 md:pt-32"
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 text-center">
        <p
          data-hero-item
          className="text-[11px] font-medium uppercase tracking-[0.32em] text-baby-blue md:text-xs"
        >
          Social Marketers Network
        </p>
        <h1
          data-hero-item
          className="font-display mx-auto mt-4 max-w-3xl text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Where marketers <span className="text-baby-blue">belong</span>
        </h1>
        <p
          data-hero-item
          className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/60 md:text-base"
        >
          Strategy, AI, community, and real client work. Not just another course platform.
        </p>
      </div>

      {/* Fan photo gallery */}
      <div className="relative z-10 mb-6 mt-10 flex h-[280px] w-full items-center justify-center sm:h-[320px] lg:h-[360px]">
        <motion.div
          className="relative mx-auto flex w-full max-w-7xl justify-center"
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
            <div className="relative h-[180px] w-[180px] sm:h-[200px] sm:w-[200px] lg:h-[220px] lg:w-[220px]">
              {[...photos].reverse().map((photo, reverseIndex) => {
                const index = photos.length - 1 - reverseIndex;
                const spread = isWide
                  ? { x: photo.x, y: photo.y }
                  : photosMd[index] || { x: photo.x, y: photo.y };

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
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div data-hero-item className="relative z-10 flex w-full flex-col items-center px-6 pb-10">
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/apply" className="min-w-[170px] px-8 py-3.5">
            Become a Member
          </Button>
          <Button href="/programs/cohort" variant="secondary" className="min-w-[150px]">
            View cohort
          </Button>
        </div>
        <p className="mt-8 text-center text-xs tracking-[0.18em] text-white/35 uppercase md:mt-10">
          Next cohort {site.cohort.startDate} · {site.cohort.seats} seats · {site.cohort.duration}
        </p>
      </div>

    </section>
  );
}

function getRandomNumberInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

const MotionImage = motion.create(
  forwardRef(function MotionImage(props: ImageProps, ref: Ref<HTMLImageElement>) {
    return <Image ref={ref} {...props} />;
  }),
);

function Photo({
  src,
  alt,
  className,
  direction,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  direction?: Direction;
  width: number;
  height: number;
  priority?: boolean;
}) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const randomRotation =
      getRandomNumberInRange(1.5, 4.5) * (direction === "left" ? -1 : 1);
    setRotation(randomRotation);
  }, [direction]);

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileTap={{ scale: 1.15, zIndex: 9999 }}
      whileHover={{
        scale: 1.08,
        rotateZ: 2 * (direction === "left" ? -1 : 1),
        zIndex: 9999,
      }}
      whileDrag={{
        scale: 1.1,
        zIndex: 9999,
      }}
      initial={{ rotate: 0 }}
      animate={{ rotate: rotation }}
      style={{
        perspective: 400,
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
        touchAction: "none",
      }}
      className={cn(
        className,
        "relative mx-auto h-[150px] w-[150px] shrink-0 cursor-grab active:cursor-grabbing sm:h-[200px] sm:w-[200px] lg:h-[220px] lg:w-[220px]",
      )}
      draggable={false}
      tabIndex={0}
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-surface">
        <MotionImage
          className="rounded-3xl object-cover"
          fill
          src={src}
          alt={alt}
          sizes="(max-width: 640px) 150px, (max-width: 1024px) 200px, 220px"
          priority={priority}
          draggable={false}
        />
        <div className="image-matte rounded-3xl" />
      </div>
    </motion.div>
  );
}
