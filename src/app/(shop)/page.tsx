import type { Metadata } from "next";
import { getWines } from "@/lib/api/wines";
import { HeroSection } from "@/components/sections/HeroSection";
import { MarqueeStrip } from "@/components/ui/MarqueeStrip";
import { CollectionGrid } from "@/components/sections/CollectionGrid";
import { WineJourney } from "@/components/sections/WineJourney";
import { StatsBar } from "@/components/sections/StatsBar";
import { StoriesCarousel } from "@/components/sections/StoriesCarousel";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { CtaSection } from "@/components/sections/CtaSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "VINO12 | Premium Wijnbox — 12 Wijnen, Perfecte Balans",
  description:
    "12 premium wijnen, zorgvuldig gecureerd. 6 rood, 6 wit. Van licht en fris tot vol en complex. Gratis verzending binnen Nederland.",
};

export default async function HomePage() {
  const wines = await getWines();

  return (
    <>
      <HeroSection />
      <MarqueeStrip text="6 ROOD · 6 WIT · PERFECTE BALANS · €175 PER BOX · GRATIS VERZENDING · PREMIUM WIJNEN" />
      <CollectionGrid wines={wines} />
      <WineJourney wines={wines} />
      <StatsBar />
      <StoriesCarousel wines={wines} />
      <PhilosophySection />
      <CtaSection />
    </>
  );
}
