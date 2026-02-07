import type { Wine } from "@/lib/types";
import { colorHex, colorLabel } from "@/lib/utils";

interface StorySlideProps {
  wine: Wine;
}

const emojis: Record<string, string> = {
  "Pinot Noir": "🍒",
  Gamay: "🫐",
  Grenache: "🌞",
  Merlot: "🍫",
  "Cabernet Franc": "🌿",
  "Cabernet Sauvignon": "🏔️",
  "Sauvignon Blanc": "🍋",
  "Albariño": "🌊",
  Vermentino: "🌿",
  Chardonnay: "🪨",
  Viognier: "🌸",
  Riesling: "⚡",
};

export function StorySlide({ wine }: StorySlideProps) {
  return (
    <div
      className="w-full h-full flex flex-col justify-between p-6"
      style={{
        background: `linear-gradient(180deg, ${colorHex(wine.color)}15 0%, ${colorHex(wine.color)}40 100%)`,
      }}
    >
      {/* Top: emoji + number */}
      <div className="flex items-center justify-between">
        <span className="text-3xl md:text-5xl">{emojis[wine.name] || "🍷"}</span>
        <span className="font-display text-4xl md:text-6xl font-bold text-ink/10">
          {String(wine.id).padStart(2, "0")}
        </span>
      </div>

      {/* Middle: wine info */}
      <div className="flex-1 flex flex-col justify-center">
        <span
          className="inline-block w-fit font-accent text-[10px] uppercase tracking-widest px-2 py-1 border border-ink mb-3"
          style={{ backgroundColor: colorHex(wine.color), color: "#F7E6CA" }}
        >
          {colorLabel(wine.color)} · {wine.body}
        </span>
        <h3 className="font-display text-3xl font-bold text-ink mb-1">
          {wine.name}
        </h3>
        <p className="font-accent text-xs uppercase tracking-widest text-ink/60 mb-4">
          {wine.region}, {wine.country}
        </p>
        <p className="font-body text-lg text-ink/80 leading-relaxed">
          {wine.description}
        </p>
      </div>

      {/* Bottom: tasting notes preview */}
      <div className="border-t-2 border-ink/20 pt-4">
        <p className="font-accent text-[10px] uppercase tracking-widest text-wine mb-2">
          Proef
        </p>
        <div className="flex flex-wrap gap-1">
          {wine.tastingNotes.palate.slice(0, 3).map((note) => (
            <span
              key={note}
              className="font-body text-sm bg-offwhite/80 px-2 py-0.5 border border-ink/30"
            >
              {note}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
