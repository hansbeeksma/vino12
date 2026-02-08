import { lazy, Suspense } from "react";
import type { Metadata } from "next";
import { getWines } from "@/lib/api/wines";
import { HeroSection } from "@/components/sections/HeroSection";
import { CollectionGrid } from "@/components/sections/CollectionGrid";
import { WineJourney } from "@/components/sections/WineJourney";
import { StoriesCarousel } from "@/components/sections/StoriesCarousel";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { CtaSection } from "@/components/sections/CtaSection";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";

const PhysicsPlayground = lazy(() =>
  import("@/components/effects/PhysicsPlayground").then((m) => ({
    default: m.PhysicsPlayground,
  })),
);

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
      <HeroSection wines={wines} />
      <CollectionGrid wines={wines} />
      {wines.length > 0 && <WineJourney wines={wines} />}
      {wines.length > 0 && <StoriesCarousel wines={wines} />}
      <PhilosophySection />
      <section className="section-padding bg-offwhite border-y-brutal border-ink">
        <div className="container-brutal">
          <h2 className="font-display text-display-sm text-ink mb-2">
            SPEELVELD
          </h2>
          <p className="font-body text-ink/60 mb-6">
            Klik om druiven, kurken en wijndruppels te laten vallen.
          </p>
        </div>
        <div className="container-brutal">
          <div className="border-brutal border-ink brutal-shadow bg-champagne/20 h-[300px] md:h-[400px]">
            <Suspense fallback={null}>
              <PhysicsPlayground className="w-full h-full" />
            </Suspense>
          </div>
        </div>
      </section>
      <CtaSection />
    </>
  );
}
