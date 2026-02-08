"use client";

import Link from "next/link";
import type { MatchResult } from "@/lib/cv/wine-matcher";

interface ScanResultProps {
  matches: MatchResult[];
  onRetry: () => void;
}

function ConfidenceBar({
  confidence,
  label,
}: {
  confidence: number;
  label?: string;
}) {
  const percent = Math.round(confidence * 100);
  const isHigh = confidence > 0.6;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-ink/10 border border-ink/20">
        <div
          className={`h-full ${isHigh ? "bg-emerald-600" : "bg-wine"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="font-accent text-xs font-bold text-ink shrink-0">
        {percent}%
      </span>
      {label && (
        <span className="font-accent text-[10px] text-ink/40 shrink-0">
          {label}
        </span>
      )}
    </div>
  );
}

export function ScanResult({ matches, onRetry }: ScanResultProps) {
  const bestMatch = matches[0];
  const alternatives = matches.slice(1);
  const isHighConfidence = bestMatch.confidence > 0.6;

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Primary match */}
      <div className="border-4 border-ink p-6 brutal-shadow bg-offwhite">
        <span className="font-accent text-[10px] uppercase tracking-widest text-ink/40">
          Beste match
        </span>

        <h3 className="font-display text-2xl font-bold text-ink mt-2">
          {bestMatch.name}
        </h3>

        <div className="mt-3">
          <ConfidenceBar confidence={bestMatch.confidence} label="match" />
        </div>

        <p className="font-body text-sm text-ink/60 mt-2">
          {isHighConfidence
            ? "Hoge match zekerheid"
            : "Lage match zekerheid — controleer handmatig"}
        </p>

        <div className="flex gap-2 mt-6">
          <Link
            href={`/wijn/${bestMatch.slug}`}
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
      </div>

      {/* Alternative suggestions */}
      {alternatives.length > 0 && (
        <div className="border-2 border-ink/30 p-4 bg-offwhite">
          <span className="font-accent text-[10px] uppercase tracking-widest text-ink/40">
            Alternatieven
          </span>
          <div className="mt-3 space-y-3">
            {alternatives.map((alt) => (
              <Link
                key={alt.wineId}
                href={`/wijn/${alt.slug}`}
                className="flex items-center justify-between gap-3 group"
              >
                <span className="font-body text-sm text-ink group-hover:text-wine transition-colors">
                  {alt.name}
                </span>
                <div className="w-24">
                  <ConfidenceBar confidence={alt.confidence} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onRetry}
        className="w-full font-body text-sm text-ink/50 hover:text-wine text-center py-2"
      >
        Dit is niet de juiste wijn? Zoek handmatig →
      </button>
    </div>
  );
}
