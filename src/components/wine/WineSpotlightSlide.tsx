"use client";

import { motion } from "motion/react";
import { getWineAsset } from "@/lib/wines/wineAssets";

interface WineSpotlightSlideProps {
  name: string;
  slug: string;
  region: string | null;
  vintage: number | null;
  isActive: boolean;
}

export function WineSpotlightSlide({
  name,
  slug,
  region,
  vintage,
  isActive,
}: WineSpotlightSlideProps) {
  const src = getWineAsset(slug);

  return (
    <div className="flex flex-col items-center justify-end px-4 pb-4 select-none">
      <motion.div
        animate={
          isActive
            ? { y: [0, -6, 0], scale: 1, opacity: 1, filter: "blur(0px)" }
            : { y: 0, scale: 0.85, opacity: 0.4, filter: "blur(2px)" }
        }
        transition={
          isActive
            ? {
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 0.6, ease: [0.39, 0.24, 0.3, 1] },
                opacity: { duration: 0.4 },
                filter: { duration: 0.4 },
              }
            : {
                scale: { duration: 0.6, ease: [0.39, 0.24, 0.3, 1] },
                opacity: { duration: 0.4 },
                filter: { duration: 0.4 },
              }
        }
      >
        <img
          src={src}
          alt={name}
          className="h-[280px] md:h-[400px] w-auto object-contain"
          loading={isActive ? "eager" : "lazy"}
          draggable={false}
        />
      </motion.div>

      <motion.div
        className="mt-4 text-center"
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="font-display text-lg md:text-xl font-bold text-ink">
          {name}
        </p>
        {(region || vintage) && (
          <p className="font-accent text-sm text-wine">
            {[region, vintage].filter(Boolean).join(" · ")}
          </p>
        )}
      </motion.div>
    </div>
  );
}
