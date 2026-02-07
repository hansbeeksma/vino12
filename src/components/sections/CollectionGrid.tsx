"use client";

import { useState } from "react";
import type { WineRow } from "@/lib/api/wines";
import type { WineType } from "@/lib/schemas/wine";
import { WineCard } from "@/components/wine/WineCard";
import { SectionLabel } from "@/components/ui/SectionLabel";

type Filter = "all" | WineType;

interface CollectionGridProps {
  wines: WineRow[];
}

export function CollectionGrid({ wines }: CollectionGridProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered =
    filter === "all" ? wines : wines.filter((w) => w.type === filter);

  const filters: { label: string; value: Filter }[] = [
    { label: "Alles", value: "all" },
    { label: "Rood", value: "red" },
    { label: "Wit", value: "white" },
  ];

  return (
    <section id="collectie" className="section-padding bg-offwhite">
      <div className="container-brutal">
        <SectionLabel>De Collectie</SectionLabel>
        <h2 className="font-display text-display-md text-ink mb-8">
          12 WIJNEN.
          <br />
          <span className="text-wine">ZORGVULDIG GEKOZEN.</span>
        </h2>

        <div className="flex gap-2 mb-8">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`font-accent text-xs font-bold uppercase tracking-widest px-4 py-2.5 md:py-2 border-2 border-ink ${
                filter === f.value
                  ? "bg-ink text-offwhite"
                  : "bg-offwhite text-ink brutal-shadow brutal-hover"
              }`}
            >
              {f.label}
              <span className="ml-1 text-[10px]">
                (
                {f.value === "all"
                  ? wines.length
                  : wines.filter((w) => w.type === f.value).length}
                )
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {filtered.map((wine) => (
            <WineCard key={wine.id} wine={wine} />
          ))}
        </div>
      </div>
    </section>
  );
}
