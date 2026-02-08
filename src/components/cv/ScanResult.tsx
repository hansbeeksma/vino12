"use client";

import Link from "next/link";

interface ScanResultProps {
  name: string;
  slug: string;
  confidence: number;
  imageUrl?: string;
  onRetry: () => void;
}

export function ScanResult({
  name,
  slug,
  confidence,
  onRetry,
}: ScanResultProps) {
  const confidencePercent = Math.round(confidence * 100);
  const isHighConfidence = confidence > 0.6;

  return (
    <div className="border-4 border-ink p-6 max-w-md mx-auto brutal-shadow bg-offwhite">
      <span className="font-accent text-[10px] uppercase tracking-widest text-ink/40">
        Match gevonden
      </span>

      <h3 className="font-display text-2xl font-bold text-ink mt-2">{name}</h3>

      <div className="flex items-center gap-2 mt-3">
        <div className="flex-1 h-2 bg-ink/10 border border-ink/20">
          <div
            className={`h-full ${isHighConfidence ? "bg-emerald-600" : "bg-wine"}`}
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
        <span className="font-accent text-xs font-bold text-ink">
          {confidencePercent}%
        </span>
      </div>

      <p className="font-body text-sm text-ink/60 mt-2">
        {isHighConfidence
          ? "Hoge match zekerheid"
          : "Lage match zekerheid — controleer handmatig"}
      </p>

      <div className="flex gap-2 mt-6">
        <Link
          href={`/wijn/${slug}`}
          className="flex-1 bg-ink text-offwhite font-accent text-xs uppercase tracking-widest text-center py-3 border-2 border-ink hover:bg-wine transition-colors"
        >
          Bekijk Wijn
        </Link>
        <button
          onClick={onRetry}
          className="px-4 py-3 border-2 border-ink font-accent text-xs uppercase tracking-widest text-ink hover:bg-champagne"
        >
          Opnieuw
        </button>
      </div>

      <button
        onClick={onRetry}
        className="w-full mt-3 font-body text-sm text-ink/50 hover:text-wine text-center py-2"
      >
        Dit is niet de juiste wijn? Zoek handmatig →
      </button>
    </div>
  );
}
