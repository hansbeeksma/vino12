import { BrutalButton } from "@/components/ui/BrutalButton";
import { WineCarousel } from "@/components/sections/WineCarousel";
import type { WineRow } from "@/lib/api/wines";

interface HeroSectionProps {
  wines: WineRow[];
}

export function HeroSection({ wines }: HeroSectionProps) {
  return (
    <section className="min-h-screen flex flex-col justify-center relative bg-offwhite border-b-brutal-lg border-ink overflow-hidden">
      <div className="container-brutal px-4 md:px-8 pt-16 pb-8 relative z-10">
        <div>
          <h1 className="font-display text-display-hero text-ink leading-none mb-6">
            VINO
            <br />
            <span className="text-wine">12</span>
          </h1>

          <div className="max-w-xl">
            <p className="font-display text-xl md:text-2xl font-bold text-ink mb-8">
              6 ROOD. 6 WIT. PERFECTE BALANS.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-12">
            <BrutalButton variant="primary" size="lg" href="/wijnen">
              Ontdek de box →
            </BrutalButton>
            <BrutalButton variant="outline-solid" size="lg" href="#collectie">
              Bekijk collectie ↓
            </BrutalButton>
          </div>
        </div>
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
    </section>
  );
}
