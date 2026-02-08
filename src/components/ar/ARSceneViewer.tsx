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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

  const handleShare = useCallback(async () => {
    if (!videoRef.current || !selectedWine) return;

    const video = videoRef.current;
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Draw wine info overlay on canvas
    const padding = 20;
    const boxHeight = 120;
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, canvas.height - boxHeight, canvas.width, boxHeight);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText(selectedWine.name, padding, canvas.height - boxHeight + 35);

    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#CCCCCC";
    ctx.fillText(
      `${selectedWine.region} · €${selectedWine.price.toFixed(2)}`,
      padding,
      canvas.height - boxHeight + 60,
    );

    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#999999";
    ctx.fillText(
      "VINO12 AR Experience",
      padding,
      canvas.height - boxHeight + 90,
    );

    const { shareARCapture } = await import("@/lib/ar/share");
    await shareARCapture(canvas, selectedWine.name);
  }, [videoRef, selectedWine]);

  // CV-based wine detection: uses MobileNet feature matching
  useEffect(() => {
    if (!scanning || !isActive) return;

    let cancelled = false;

    const runDetection = async () => {
      if (cancelled || !scanning || selectedWine || isAnalyzing) return;

      const frame = captureFrame();
      if (!frame) return;

      setIsAnalyzing(true);

      try {
        const { extractFeatures, findClosestWines } =
          await import("@/lib/cv/wine-matcher");
        const features = await extractFeatures(frame);
        const matches = await findClosestWines(features, 1);

        if (!cancelled && matches.length > 0 && matches[0].confidence > 0.4) {
          const matchedWine = wines.find((w) => w.id === matches[0].wineId);
          if (matchedWine) {
            setSelectedWine(matchedWine);
          }
        }
      } catch (err) {
        console.error("AR detection failed:", err);
      } finally {
        setIsAnalyzing(false);
      }
    };

    scanIntervalRef.current = setInterval(runDetection, 3000);

    return () => {
      cancelled = true;
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [scanning, isActive, captureFrame, wines, selectedWine, isAnalyzing]);

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
                  {selectedWine
                    ? "Wijn herkend!"
                    : isAnalyzing
                      ? "Analyseren..."
                      : "Scannen..."}
                </span>
              </div>
            </div>

            {/* Control buttons */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
              {selectedWine && (
                <button
                  onClick={handleShare}
                  className="bg-champagne text-ink font-accent text-xs uppercase tracking-widest px-6 py-3 border-2 border-ink brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-transform"
                >
                  Delen
                </button>
              )}
              <button
                onClick={handleStop}
                className="bg-offwhite text-ink font-accent text-xs uppercase tracking-widest px-6 py-3 border-2 border-ink"
              >
                Stop Camera
              </button>
            </div>
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
              onShare={handleShare}
            />
          )}
        </>
      )}
    </div>
  );
}
