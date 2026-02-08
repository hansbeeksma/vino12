import Image from "next/image";
import type { WineRow } from "@/lib/api/wines";
import { typeColorHex, typeLabel, bodyLabel } from "@/lib/utils";
import { BrutalBadge } from "@/components/ui/BrutalBadge";
import { BodyScale } from "./BodyScale";
import { WishlistButton } from "./WishlistButton";

interface WineDetailProps {
  wine: WineRow;
}

export function WineDetail({ wine }: WineDetailProps) {
  const isRed = wine.type === "red";
  const body = bodyLabel(wine.body);

  return (
    <div className="container-brutal px-4 py-8 md:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Left: Product photo */}
        <div className="border-brutal border-ink brutal-shadow bg-offwhite aspect-3/4 flex items-center justify-center relative p-8">
          <div
            className="absolute top-0 left-0 right-0 h-3"
            style={{ backgroundColor: typeColorHex(wine.type) }}
          />
          {wine.image_url && (
            <Image
              src={wine.image_url}
              alt={`${wine.name}${wine.region ? ` - ${wine.region.name}` : ""}`}
              width={500}
              height={667}
              className="object-contain max-h-full w-auto"
              priority
            />
          )}
        </div>

        {/* Right: Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <BrutalBadge variant={isRed ? "wine" : "emerald"}>
                {typeLabel(wine.type)}
              </BrutalBadge>
              {body && <BrutalBadge variant="champagne">{body}</BrutalBadge>}
              {wine.region && (
                <BrutalBadge variant="ink">{wine.region.country}</BrutalBadge>
              )}
            </div>
            <h1 className="font-display text-display-lg text-ink mb-2">
              {wine.name}
            </h1>
            {wine.region && (
              <p className="font-accent text-sm uppercase tracking-widest text-ink/60">
                {wine.region.name}, {wine.region.country}
              </p>
            )}
          </div>

          <div className="flex items-center gap-6">
            <span className="font-accent text-xs text-ink/50">
              {wine.vintage && `${wine.vintage} · `}
              {wine.alcohol_percentage && `${wine.alcohol_percentage}%`}
            </span>
            <WishlistButton wineId={wine.id} />
          </div>

          {body && (
            <BodyScale body={body} color={isRed ? "bg-wine" : "bg-emerald"} />
          )}

          {wine.description && (
            <p className="font-body text-base md:text-lg lg:text-xl leading-relaxed">
              {wine.description}
            </p>
          )}

          {wine.tasting_notes && (
            <div className="border-t-2 border-ink pt-6">
              <h3 className="font-accent text-xs uppercase tracking-widest text-wine mb-4">
                Proefnotities
              </h3>
              <p className="font-body text-base leading-relaxed">
                {wine.tasting_notes}
              </p>
            </div>
          )}

          {wine.food_pairing && (
            <div className="border-t-2 border-ink pt-6">
              <h3 className="font-accent text-xs uppercase tracking-widest text-wine mb-4">
                Past bij
              </h3>
              <div className="flex flex-wrap gap-2">
                {wine.food_pairing.split(", ").map((pairing) => (
                  <span
                    key={pairing}
                    className="font-accent text-xs uppercase tracking-widest bg-champagne border-2 border-ink px-3 py-1.5"
                  >
                    {pairing}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
