import type { Metadata } from "next";
import { getWines } from "@/lib/api/wines";
import { HeroSection } from "@/components/sections/HeroSection";
import { MarqueeStrip } from "@/components/ui/MarqueeStrip";
import { CollectionGrid } from "@/components/sections/CollectionGrid";
import { WineJourney } from "@/components/sections/WineJourney";
import { StoriesCarousel } from "@/components/sections/StoriesCarousel";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { CtaSection } from "@/components/sections/CtaSection";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "VINO12 | Premium Wijnbox — 12 Wijnen, Perfecte Balans",
  description:
    "12 premium wijnen, zorgvuldig gecureerd. 6 rood, 6 wit. Van licht en fris tot vol en complex. Gratis verzending binnen Nederland.",
};

export default async function HomePage() {
  let wines: Awaited<ReturnType<typeof getWines>>;
  try {
    wines = await getWines();
  } catch (err) {
    console.error("Homepage wine fetch failed:", err);
    wines = [];
  }

  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <HeroSection />
      <MarqueeStrip text="6 ROOD · 6 WIT · PERFECTE BALANS · GRATIS VERZENDING · PREMIUM WIJNEN" />
      <CollectionGrid wines={wines} />
      {wines.length > 0 && <WineJourney wines={wines} />}
      {wines.length > 0 && <StoriesCarousel wines={wines} />}
      <PhilosophySection />
      <CtaSection />
    </>
  );
}
