"use client";

import { BrutalButton } from "@/components/ui/BrutalButton";
import { BottleSilhouette } from "@/components/wine/BottleSilhouette";

export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center relative bg-offwhite border-b-brutal-lg border-ink overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none">
        <BottleSilhouette
          shape="bordeaux"
          color="#722F37"
          className="absolute right-[5%] top-[10%] h-[70vh] opacity-[0.04]"
        />
        <BottleSilhouette
          shape="bourgogne"
          color="#00674F"
          className="absolute left-[8%] top-[15%] h-[60vh] opacity-[0.03]"
        />
      </div>

      <div className="container-brutal px-4 md:px-8 pt-24 pb-16 relative z-10">
        <div>
          <p className="font-accent text-xs uppercase tracking-[0.3em] text-wine mb-4 md:mb-6">
            Premium Wijnbox
          </p>

          <h1 className="font-display text-display-hero text-ink leading-none mb-6">
            VINO
            <br />
            <span className="text-wine">12</span>
          </h1>

          <div className="max-w-xl">
            <p className="font-display text-xl md:text-2xl font-bold text-ink mb-2">
              6 ROOD. 6 WIT. PERFECTE BALANS.
            </p>
            <p className="font-body text-xl md:text-2xl text-ink/70 mb-8">
              12 premium wijnen, zorgvuldig gecureerd. Van licht en fris tot vol
              en complex. Eén box, alle smaken.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-12">
            <BrutalButton variant="primary" size="lg" href="/wijnen">
              Bekijk wijnen — €175
            </BrutalButton>
            <BrutalButton variant="outline-solid" size="lg" href="#collectie">
              Bekijk collectie ↓
            </BrutalButton>
          </div>

          <div className="flex items-center gap-6 md:gap-8">
            <div className="text-center">
              <span className="font-display text-3xl md:text-4xl font-bold text-wine block">
                12
              </span>
              <span className="font-accent text-[10px] uppercase tracking-widest text-ink/50">
                Flessen
              </span>
            </div>
            <div className="w-px h-10 bg-ink/20" />
            <div className="text-center">
              <span className="font-display text-3xl md:text-4xl font-bold text-wine block">
                6
              </span>
              <span className="font-accent text-[10px] uppercase tracking-widest text-ink/50">
                Landen
              </span>
            </div>
            <div className="w-px h-10 bg-ink/20" />
            <div className="text-center">
              <span className="font-display text-3xl md:text-4xl font-bold text-ink block">
                €14,58
              </span>
              <span className="font-accent text-[10px] uppercase tracking-widest text-ink/50">
                Per fles
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-8 h-12 border-2 border-ink flex items-end justify-center pb-2">
          <div className="w-1.5 h-3 bg-wine" />
        </div>
      </div>
    </section>
  );
}
