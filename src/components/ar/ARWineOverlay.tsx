"use client";

import Link from "next/link";

interface ARWineOverlayProps {
  name: string;
  type: string;
  price: number;
  region: string;
  tastingNotes: string;
  slug: string;
  onClose: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  red: "ROOD",
  white: "WIT",
  rose: "ROSÉ",
  sparkling: "MOUSSEUX",
  dessert: "DESSERT",
  orange: "ORANJE",
};

export function ARWineOverlay({
  name,
  type,
  price,
  region,
  tastingNotes,
  slug,
  onClose,
}: ARWineOverlayProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom">
      <div className="bg-offwhite border-4 border-ink p-4 max-w-md mx-auto brutal-shadow">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <span className="font-accent text-[10px] uppercase tracking-widest text-wine">
              {TYPE_LABELS[type] ?? type.toUpperCase()} · {region}
            </span>
            <h3 className="font-display text-xl font-bold text-ink mt-1 truncate">
              {name}
            </h3>
            <p className="font-display text-2xl font-bold text-wine mt-1">
              €{price.toFixed(2).replace(".", ",")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 border-2 border-ink flex items-center justify-center shrink-0 hover:bg-champagne"
            aria-label="Sluiten"
          >
            ✕
          </button>
        </div>

        {tastingNotes && (
          <p className="font-body text-sm text-ink/70 mt-2 line-clamp-2">
            {tastingNotes}
          </p>
        )}

        <div className="flex gap-2 mt-4">
          <Link
            href={`/wijn/${slug}`}
            className="flex-1 bg-ink text-offwhite font-accent text-xs uppercase tracking-widest text-center py-3 border-2 border-ink hover:bg-wine transition-colors"
          >
            Bekijk Details
          </Link>
        </div>
      </div>
    </div>
  );
}
