"use client";

import { useRef, lazy, Suspense } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { WineCarousel } from "@/components/sections/WineCarousel";
import type { WineRow } from "@/lib/api/wines";

const WineParticles = lazy(() =>
  import("@/components/effects/WineParticles").then((m) => ({
    default: m.WineParticles,
  })),
);

const HeroGradient = lazy(() =>
  import("@/components/effects/HeroGradient").then((m) => ({
    default: m.HeroGradient,
  })),
);

interface HeroSectionProps {
  wines: WineRow[];
}

export function HeroSection({ wines }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const yTitle = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
  const opacityTitle = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center relative bg-offwhite overflow-hidden"
    >
      <Suspense fallback={null}>
        <HeroGradient className="absolute inset-0 z-0 opacity-30 pointer-events-none" />
      </Suspense>
      <Suspense fallback={null}>
        <WineParticles
          variant="hero"
          className="absolute inset-0 z-[1] pointer-events-none"
        />
      </Suspense>
      <div className="container-brutal px-4 md:px-8 pt-16 pb-0 relative z-10">
        <motion.h1
          style={{ y: yTitle, opacity: opacityTitle }}
          className="font-display text-display-hero text-ink leading-none"
        >
          VINO
          <br />
          <span className="text-wine">12</span>
        </motion.h1>
      </div>

      {wines.length > 0 ? (
        <WineCarousel wines={wines} />
      ) : (
        <div className="w-full overflow-hidden">
          <img
            src="/images/wines/collection-feb.svg"
            alt="VINO12 collectie — 12 premium wijnen"
            className="h-auto w-full"
          />
        </div>
      )}

      <div className="container-brutal px-4 md:px-8 pt-8 pb-16 relative z-10">
        <div className="flex flex-wrap items-center gap-4">
          <BrutalButton variant="primary" size="lg" href="/wijnen">
            Ontdek de box →
          </BrutalButton>
          <BrutalButton variant="outline-solid" size="lg" href="#collectie">
            Bekijk collectie ↓
          </BrutalButton>
        </div>
      </div>
    </section>
  );
}
