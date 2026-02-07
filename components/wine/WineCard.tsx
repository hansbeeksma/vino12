import Link from "next/link";
import type { Wine } from "@/lib/types";
import { colorHex, colorLabel } from "@/lib/utils";
import { BodyScale } from "./BodyScale";
import { BottleSilhouette } from "./BottleSilhouette";

interface WineCardProps {
  wine: Wine;
  className?: string;
}

export function WineCard({ wine, className = "" }: WineCardProps) {
  const isRed = wine.color === "red";

  return (
    <Link href={`/wijn/${wine.slug}`} className={`block group ${className}`}>
      <div className="aspect-square border-brutal border-ink brutal-shadow brutal-hover bg-offwhite relative overflow-hidden flex flex-col">
        {/* Color indicator top bar */}
        <div
          className="h-2 w-full"
          style={{ backgroundColor: colorHex(wine.color) }}
        />

        {/* SVG bottle silhouette */}
        <div className="flex-1 flex items-center justify-center px-6 py-4">
          <BottleSilhouette
            shape={wine.bottleShape}
            color={colorHex(wine.color)}
            className="h-full max-h-[55%] opacity-15"
          />
        </div>

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-offwhite/95 border-t-2 border-ink">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-3 h-3 border border-ink inline-block"
                  style={{ backgroundColor: colorHex(wine.color) }}
                />
                <span className="font-accent text-[10px] uppercase tracking-widest text-ink/50">
                  {colorLabel(wine.color)}
                </span>
              </div>
              <h3 className="font-display text-lg font-bold leading-tight">
                {wine.name}
              </h3>
            </div>
            <span className="font-accent text-xs font-bold text-wine whitespace-nowrap">
              €{wine.price}
            </span>
          </div>
          <p className="font-accent text-[10px] uppercase tracking-widest text-ink/60 mb-2">
            {wine.region}, {wine.countryCode}
          </p>
          <BodyScale
            body={wine.body}
            color={isRed ? "bg-wine" : "bg-emerald"}
          />
        </div>
      </div>
    </Link>
  );
}
