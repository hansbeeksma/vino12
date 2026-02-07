import type { WineRow } from "@/lib/api/wines";
import { typeColorHex, typeLabel, bodyLabel } from "@/lib/utils";

interface StorySlideProps {
  wine: WineRow;
}

export function StorySlide({ wine }: StorySlideProps) {
  const colorHex = typeColorHex(wine.type);

  return (
    <div
      className="w-full h-full flex flex-col justify-between p-6"
      style={{
        background: `linear-gradient(180deg, ${colorHex}15 0%, ${colorHex}40 100%)`,
      }}
    >
      {/* Top: color swatch + number */}
      <div className="flex items-center justify-between">
        <div className="w-12 h-16 md:w-16 md:h-20 border-2 border-ink bg-offwhite flex items-center justify-center">
          <div
            className="w-8 h-12 md:w-10 md:h-14 border border-ink"
            style={{ backgroundColor: colorHex, opacity: 0.5 }}
          />
        </div>
        <span className="font-display text-4xl md:text-6xl font-bold text-ink/10">
          {wine.vintage ?? "NV"}
        </span>
      </div>

      {/* Middle: wine info */}
      <div className="flex-1 flex flex-col justify-center">
        <span
          className="inline-block w-fit font-accent text-[10px] uppercase tracking-widest px-2 py-1 border border-ink mb-3"
          style={{ backgroundColor: colorHex, color: "#F7E6CA" }}
        >
          {typeLabel(wine.type)}
          {wine.body ? ` · ${bodyLabel(wine.body)}` : ""}
        </span>
        <h3 className="font-display text-3xl font-bold text-ink mb-1">
          {wine.name}
        </h3>
        <p className="font-accent text-xs uppercase tracking-widest text-ink/60 mb-4">
          {wine.region?.name}
          {wine.region?.country ? `, ${wine.region.country}` : ""}
        </p>
        <p className="font-body text-lg text-ink/80 leading-relaxed line-clamp-4">
          {wine.description}
        </p>
      </div>

      {/* Bottom: tasting notes preview */}
      {wine.tasting_notes && (
        <div className="border-t-2 border-ink/20 pt-4">
          <p className="font-accent text-[10px] uppercase tracking-widest text-wine mb-2">
            Proef
          </p>
          <div className="flex flex-wrap gap-1">
            {wine.tasting_notes
              .split("\n")
              .filter(Boolean)
              .slice(0, 3)
              .map((note) => (
                <span
                  key={note}
                  className="font-body text-sm bg-offwhite/80 px-2 py-0.5 border border-ink/30"
                >
                  {note}
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
