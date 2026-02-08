"use client";

import { useState, useCallback } from "react";
import { useCamera } from "@/hooks/useCamera";
import { ScanResult } from "./ScanResult";
import type { MatchResult } from "@/lib/cv/wine-matcher";

export function WineScanner() {
  const { videoRef, isActive, error, startCamera, stopCamera, captureFrame } =
    useCamera();
  const [modelLoading, setModelLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [matches, setMatches] = useState<MatchResult[]>([]);

  const handleStart = useCallback(async () => {
    setMatches([]);
    await startCamera("environment");
  }, [startCamera]);

  const handleCapture = useCallback(async () => {
    const frame = captureFrame();
    if (!frame) return;

    setAnalyzing(true);
    setModelLoading(true);

    try {
      const { extractFeatures, findClosestWines } =
        await import("@/lib/cv/wine-matcher");
      setModelLoading(false);

      const features = await extractFeatures(frame);
      const results = await findClosestWines(features, 3);

      if (results.length > 0) {
        setMatches(results);
        stopCamera();
      }
    } catch (err) {
      console.error("CV analysis failed:", err);
    } finally {
      setAnalyzing(false);
      setModelLoading(false);
    }
  }, [captureFrame, stopCamera]);

  const handleRetry = useCallback(() => {
    setMatches([]);
    handleStart();
  }, [handleStart]);

  if (matches.length > 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <ScanResult matches={matches} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="relative min-h-[60vh]">
      {!isActive && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
          <div className="border-4 border-ink p-8 text-center max-w-md">
            <h2 className="font-display text-2xl font-bold text-ink mb-3">
              Wijn Scanner
            </h2>
            <p className="font-body text-base text-ink/70 mb-6">
              Maak een foto van een wijnetiket en we zoeken de beste match in
              onze collectie.
            </p>
            <button
              onClick={handleStart}
              className="bg-wine text-offwhite font-accent text-xs uppercase tracking-widest px-8 py-4 border-2 border-ink brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform"
            >
              Start Camera
            </button>
            {error && (
              <p className="font-body text-sm text-wine mt-4">{error}</p>
            )}
          </div>

          <p className="font-accent text-[10px] uppercase tracking-widest text-ink/40 text-center max-w-sm">
            Tip: Houd het etiket gecentreerd en zorg voor goede belichting
          </p>
        </div>
      )}

      {isActive && (
        <div className="relative w-full h-[80vh] bg-ink overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Scanning frame overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-ink/30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.3)]" />

            {/* Scan frame */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80">
              <div className="absolute -top-1 -left-1 w-10 h-10 border-t-4 border-l-4 border-champagne" />
              <div className="absolute -top-1 -right-1 w-10 h-10 border-t-4 border-r-4 border-champagne" />
              <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-4 border-l-4 border-champagne" />
              <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-4 border-r-4 border-champagne" />
            </div>

            {/* Status */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2">
              <span className="font-accent text-xs uppercase tracking-widest text-champagne bg-ink/60 px-4 py-2">
                {analyzing
                  ? modelLoading
                    ? "Model laden..."
                    : "Analyseren..."
                  : "Richt op etiket"}
              </span>
            </div>
          </div>

          {/* Capture & Stop buttons */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
            <button
              onClick={handleCapture}
              disabled={analyzing}
              className={`bg-champagne text-ink font-accent text-xs uppercase tracking-widest px-8 py-4 border-2 border-ink ${
                analyzing
                  ? "opacity-50 cursor-not-allowed"
                  : "brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform"
              }`}
            >
              {analyzing ? "Bezig..." : "Scan Etiket"}
            </button>
            <button
              onClick={() => {
                stopCamera();
                setMatches([]);
              }}
              className="bg-offwhite text-ink font-accent text-xs uppercase tracking-widest px-4 py-4 border-2 border-ink"
            >
              Stop
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
