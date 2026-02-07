import Link from "next/link";
import Image from "next/image";
import type { Wine } from "@/lib/types";
import { colorHex, colorLabel } from "@/lib/utils";
import { BodyScale } from "./BodyScale";

interface WineCardProps {
  wine: Wine;
  className?: string;
}

export function WineCard({ wine, className = "" }: WineCardProps) {
  const isRed = wine.color === "red";

  return (
    <Link href={`/wijn/${wine.slug}`} className={`block group ${className}`}>
      <div className="aspect-[3/5] border-brutal border-ink brutal-shadow brutal-hover bg-offwhite overflow-hidden flex flex-col">
        {/* Color indicator top bar */}
        <div
          className="h-2 w-full shrink-0"
          style={{ backgroundColor: colorHex(wine.color) }}
        />

        {/* Product photo — strictly contained in white area */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="relative w-full h-full p-4 md:p-6">
            <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-300">
              <Image
                src={wine.image}
                alt={`${wine.name} - ${wine.region}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          </div>
        </div>

        {/* Info section */}
        <div className="shrink-0 p-3 md:p-4 bg-offwhite border-t-2 border-ink">
          <div className="flex items-start justify-between gap-2 mb-1">
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
              <h3 className="font-display text-base md:text-lg font-bold leading-tight">
                {wine.name}
              </h3>
            </div>
            <span className="font-accent text-xs font-bold text-wine whitespace-nowrap">
              €{wine.price}
            </span>
          </div>
          <p className="font-accent text-[10px] uppercase tracking-widest text-ink/60 mb-1">
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
