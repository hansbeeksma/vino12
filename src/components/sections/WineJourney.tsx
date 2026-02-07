"use client";

import { useRef } from "react";
import type { WineRow } from "@/lib/api/wines";
import { typeColorHex, bodyToNumber, bodyLabel } from "@/lib/utils";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface WineJourneyProps {
  wines: WineRow[];
}

export function WineJourney({ wines }: WineJourneyProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const reds = wines.filter((w) => w.type === "red");
  const whites = wines.filter((w) => w.type === "white");

  return (
    <section
      id="reis"
      className="section-padding bg-champagne border-y-brutal border-ink"
    >
      <div className="container-brutal">
        <SectionLabel>De Wijnreis</SectionLabel>
        <h2 className="font-display text-display-md text-ink mb-4">
          VAN LICHT
          <br />
          <span className="text-wine">NAAR VOL.</span>
        </h2>
        <p className="font-body text-xl text-ink/70 max-w-lg mb-8">
          Elke box vertelt een verhaal. Van delicate Pinot Noir tot krachtige
          Cabernet Sauvignon. Van frisse Sauvignon Blanc tot weelderige
          Viognier.
        </p>
      </div>

      <div ref={scrollRef} className="overflow-x-auto scrollbar-hide pb-4">
        <div className="flex gap-0 min-w-max px-4 md:px-8">
          <div className="flex flex-col">
            <div className="flex items-center gap-0">
              {reds.map((wine, i) => (
                <div key={wine.id} className="flex items-center">
                  <a
                    href={`/wijn/${wine.slug}`}
                    className="flex flex-col items-center w-32 md:w-40 group"
                  >
                    <div className="w-12 h-12 border-brutal border-ink bg-offwhite brutal-shadow brutal-hover flex items-center justify-center">
                      <div
                        className="w-6 h-6 border border-ink"
                        style={{
                          backgroundColor: typeColorHex(wine.type),
                          opacity: 0.3 + bodyToNumber(wine.body) * 0.14,
                        }}
                      />
                    </div>
                    <div className="mt-3 text-center">
                      <p className="font-display text-xs font-bold leading-tight">
                        {wine.name}
                      </p>
                      {wine.region && (
                        <p className="font-accent text-[9px] uppercase tracking-widest text-ink/50 mt-0.5">
                          {wine.region.name}
                        </p>
                      )}
                      <p className="font-accent text-[9px] uppercase tracking-widest text-wine mt-0.5">
                        {bodyLabel(wine.body)}
                      </p>
                    </div>
                  </a>
                  {i < reds.length - 1 && (
                    <div className="w-8 h-0.5 bg-wine/30 -mt-8 md:-mt-10" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 pl-4">
              <div className="w-3 h-3 bg-wine border border-ink" />
              <span className="font-accent text-[10px] uppercase tracking-widest text-ink/50">
                Rood — Licht → Vol
              </span>
            </div>
          </div>

          <div className="w-8 md:w-16 flex items-center justify-center">
            <div className="w-px h-24 bg-ink/20" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-0">
              {whites.map((wine, i) => (
                <div key={wine.id} className="flex items-center">
                  <a
                    href={`/wijn/${wine.slug}`}
                    className="flex flex-col items-center w-32 md:w-40 group"
                  >
                    <div className="w-12 h-12 border-brutal border-ink bg-offwhite brutal-shadow brutal-hover flex items-center justify-center">
                      <div
                        className="w-6 h-6 border border-ink"
                        style={{
                          backgroundColor: typeColorHex(wine.type),
                          opacity: 0.3 + bodyToNumber(wine.body) * 0.14,
                        }}
                      />
                    </div>
                    <div className="mt-3 text-center">
                      <p className="font-display text-xs font-bold leading-tight">
                        {wine.name}
                      </p>
                      {wine.region && (
                        <p className="font-accent text-[9px] uppercase tracking-widest text-ink/50 mt-0.5">
                          {wine.region.name}
                        </p>
                      )}
                      <p className="font-accent text-[9px] uppercase tracking-widest text-emerald mt-0.5">
                        {bodyLabel(wine.body)}
                      </p>
                    </div>
                  </a>
                  {i < whites.length - 1 && (
                    <div className="w-8 h-0.5 bg-emerald/30 -mt-8 md:-mt-10" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 pl-4">
              <div className="w-3 h-3 bg-emerald border border-ink" />
              <span className="font-accent text-[10px] uppercase tracking-widest text-ink/50">
                Wit — Licht → Vol
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
