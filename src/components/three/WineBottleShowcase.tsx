"use client";

import { lazy, Suspense, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const WineBottle3D = lazy(() =>
  import("./WineBottle3D").then((m) => ({ default: m.WineBottle3D })),
);

interface WineBottleShowcaseProps {
  wineColor?: string;
  wineType?: "red" | "white" | "rosé" | "sparkling";
  className?: string;
}

const WINE_TYPE_COLORS: Record<string, string> = {
  red: "#722f37",
  white: "#e8dca0",
  rosé: "#d9a0a7",
  sparkling: "#f0e6c0",
};

export function WineBottleShowcase({
  wineColor,
  wineType = "red",
  className = "",
}: WineBottleShowcaseProps) {
  const [show3D, setShow3D] = useState(false);
  const color = wineColor ?? WINE_TYPE_COLORS[wineType] ?? "#722f37";

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        {show3D ? (
          <motion.div
            key="3d"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full aspect-3/4"
          >
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-accent text-xs uppercase tracking-widest text-ink/40 animate-pulse">
                    3D laden...
                  </span>
                </div>
              }
            >
              <WineBottle3D wineColor={color} />
            </Suspense>
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full aspect-3/4 flex items-center justify-center bg-offwhite border-2 border-dashed border-ink/10 cursor-pointer group"
            onClick={() => setShow3D(true)}
          >
            <div className="text-center">
              <span className="font-display text-4xl block mb-2 group-hover:scale-110 transition-transform">
                🍷
              </span>
              <span className="font-accent text-xs uppercase tracking-widest text-ink/40 group-hover:text-ink/60 transition-colors">
                Bekijk in 3D
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {show3D && (
        <button
          onClick={() => setShow3D(false)}
          className="absolute top-2 right-2 z-10 w-8 h-8 border-2 border-ink bg-offwhite flex items-center justify-center text-xs font-bold hover:bg-ink hover:text-offwhite transition-colors"
          aria-label="Sluit 3D weergave"
        >
          ✕
        </button>
      )}
    </div>
  );
}
