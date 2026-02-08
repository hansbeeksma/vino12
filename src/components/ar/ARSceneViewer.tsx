"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ARWineOverlay } from "./ARWineOverlay";
import { useCamera } from "@/hooks/useCamera";

interface WineData {
  id: number;
  name: string;
  slug: string;
  color: string;
  region: string;
  price: number;
  description: string;
  image: string;
}

interface ARSceneViewerProps {
  wines: WineData[];
}

export function ARSceneViewer({ wines }: ARSceneViewerProps) {
  const { videoRef, isActive, error, startCamera, stopCamera, captureFrame } =
    useCamera();
  const [selectedWine, setSelectedWine] = useState<WineData | null>(null);
  const [scanning, setScanning] = useState(false);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleStart = useCallback(async () => {
    await startCamera("environment");
    setScanning(true);
  }, [startCamera]);

  const handleStop = useCallback(() => {
    stopCamera();
    setScanning(false);
    setSelectedWine(null);
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
  }, [stopCamera]);

  // Simple color-based detection: scan camera feed for dominant wine-like colors
  useEffect(() => {
    if (!scanning || !isActive) return;

    scanIntervalRef.current = setInterval(() => {
      const frame = captureFrame();
      if (!frame) return;

      // Sample center region for dominant color
      const { data, width, height } = frame;
      const cx = Math.floor(width / 2);
      const cy = Math.floor(height / 2);
      const sampleSize = 50;

      let totalR = 0,
        totalG = 0,
        totalB = 0,
        count = 0;

      for (let y = cy - sampleSize; y < cy + sampleSize; y++) {
        for (let x = cx - sampleSize; x < cx + sampleSize; x++) {
          if (x < 0 || x >= width || y < 0 || y >= height) continue;
          const idx = (y * width + x) * 4;
          totalR += data[idx];
          totalG += data[idx + 1];
          totalB += data[idx + 2];
          count++;
        }
      }

      if (count === 0) return;

      const avgR = totalR / count;
      const avgG = totalG / count;
      const avgB = totalB / count;

      // Detect wine-label-like colors (dark reds, deep colors)
      const isWineColor = avgR > 80 && avgR < 200 && avgG < 100 && avgB < 100;

      if (isWineColor && !selectedWine) {
        // Pick a random wine to demonstrate AR overlay
        const randomWine = wines[Math.floor(Math.random() * wines.length)];
        setSelectedWine(randomWine);
      }
    }, 2000);

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [scanning, isActive, captureFrame, wines, selectedWine]);

  return (
    <div className="relative min-h-[60vh]">
      {!isActive && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
          <div className="border-4 border-ink p-8 text-center max-w-md">
            <h2 className="font-display text-2xl font-bold text-ink mb-3">
              AR Wijnlabels
            </h2>
            <p className="font-body text-base text-ink/70 mb-6">
              Richt je camera op een wijnfles om informatie te zien via
              augmented reality. Werkt het best met goede belichting.
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

          <div className="max-w-md text-center">
            <p className="font-accent text-[10px] uppercase tracking-widest text-ink/40">
              Tip: Houd je telefoon stabiel en zorg voor voldoende licht
            </p>
          </div>
        </div>
      )}

      {isActive && (
        <>
          <div className="relative w-full h-[80vh] bg-ink overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Scanning overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Corner markers */}
              <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-champagne" />
              <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-champagne" />
              <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-champagne" />
              <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-champagne" />

              {/* Center crosshair */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-1 h-8 bg-champagne/60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                <div className="w-8 h-1 bg-champagne/60 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>

              {/* Status */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2">
                <span className="font-accent text-xs uppercase tracking-widest text-champagne bg-ink/60 px-4 py-2">
                  {selectedWine ? "Wijn herkend!" : "Scannen..."}
                </span>
              </div>
            </div>

            {/* Stop button */}
            <button
              onClick={handleStop}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-offwhite text-ink font-accent text-xs uppercase tracking-widest px-6 py-3 border-2 border-ink"
            >
              Stop Camera
            </button>
          </div>

          {selectedWine && (
            <ARWineOverlay
              name={selectedWine.name}
              type={selectedWine.color}
              price={selectedWine.price}
              region={selectedWine.region}
              tastingNotes={selectedWine.description}
              slug={selectedWine.slug}
              onClose={() => setSelectedWine(null)}
            />
          )}
        </>
      )}
    </div>
  );
}
