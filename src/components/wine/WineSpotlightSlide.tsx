"use client";

import { motion } from "motion/react";
import { getWineAsset } from "@/lib/wines/wineAssets";

interface WineSpotlightSlideProps {
  name: string;
  slug: string;
  region: string | null;
  vintage: number | null;
  index: number;
}

export function WineSpotlightSlide({
  name,
  slug,
  region,
  vintage,
  index,
}: WineSpotlightSlideProps) {
  const src = getWineAsset(slug);

  return (
    <div className="flex flex-col items-center justify-end px-4 pb-4 select-none">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{
          y: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.15,
          },
        }}
      >
        <img
          src={src}
          alt={name}
          className="h-[220px] md:h-[320px] w-auto object-contain"
          loading="lazy"
          draggable={false}
        />
      </motion.div>

      <div className="mt-4 text-center">
        <p className="font-display text-lg md:text-xl font-bold text-ink">
          {name}
        </p>
        {(region || vintage) && (
          <p className="font-accent text-sm text-wine">
            {[region, vintage].filter(Boolean).join(" \u00B7 ")}
          </p>
        )}
      </div>
    </div>
  );
}
