"use client";

import { lazy, Suspense } from "react";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { WineCarousel } from "@/components/sections/WineCarousel";
import { FeatureFlag } from "@/components/ui/FeatureFlag";
import { HomepageCTA } from "@/components/experiments/HomepageCTA";
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
  return (
    <section className="min-h-screen flex flex-col justify-center relative bg-offwhite overflow-hidden">
      <FeatureFlag flag="effects.hero_gradient">
        <Suspense fallback={null}>
          <HeroGradient className="absolute inset-0 z-0 opacity-30 pointer-events-none" />
        </Suspense>
      </FeatureFlag>
      <FeatureFlag flag="effects.particles">
        <Suspense fallback={null}>
          <WineParticles
            variant="hero"
            className="absolute inset-0 z-[1] pointer-events-none"
          />
        </Suspense>
      </FeatureFlag>
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
          <HomepageCTA />
          <BrutalButton variant="outline-solid" size="lg" href="#collectie">
            Bekijk collectie ↓
          </BrutalButton>
        </div>
      </div>
    </section>
  );
}
