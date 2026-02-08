import Link from "next/link";
import Image from "next/image";
import type { WineRow } from "@/lib/api/wines";
import { typeColorHex, typeLabel, bodyLabel } from "@/lib/utils";
import { BodyScale } from "./BodyScale";

interface WineCardProps {
  wine: WineRow;
  className?: string;
}

export function WineCard({ wine, className = "" }: WineCardProps) {
  const isRed = wine.type === "red";

  return (
    <Link href={`/wijn/${wine.slug}`} className={`block group ${className}`}>
      <div className="aspect-3/5 border-brutal border-ink brutal-shadow brutal-hover bg-offwhite overflow-hidden flex flex-col">
        <div
          className="h-2 w-full shrink-0"
          style={{ backgroundColor: typeColorHex(wine.type) }}
        />

        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="relative w-full h-full p-4 md:p-6">
            <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-300">
              {wine.image_url && (
                <Image
                  src={wine.image_url}
                  alt={`${wine.name}${wine.region ? ` - ${wine.region.name}` : ""}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              )}
            </div>
          </div>
        </div>

        <div className="shrink-0 p-3 md:p-4 bg-offwhite border-t-2 border-ink">
          <div className="mb-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-3 h-3 border border-ink inline-block"
                style={{ backgroundColor: typeColorHex(wine.type) }}
              />
              <span className="font-accent text-[10px] uppercase tracking-widest text-ink/50">
                {typeLabel(wine.type)}
              </span>
            </div>
            <h3 className="font-display text-base md:text-lg font-bold leading-tight">
              {wine.name}
            </h3>
          </div>
          {wine.region && (
            <p className="font-accent text-[10px] uppercase tracking-widest text-ink/60 mb-1">
              {wine.region.name}, {wine.region.country}
            </p>
          )}
          <BodyScale
            body={bodyLabel(wine.body)}
            color={isRed ? "bg-wine" : "bg-emerald"}
          />
        </div>
      </div>
    </Link>
  );
}
