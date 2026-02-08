"use client";

import { useState } from "react";
import { WineSpotlightSlide } from "@/components/wine/WineSpotlightSlide";

interface CarouselWine {
  id: string;
  name: string;
  slug: string;
  region: { name: string; country: string } | null;
  vintage: number | null;
}

interface WineCarouselProps {
  wines: CarouselWine[];
}

export function WineCarousel({ wines }: WineCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);

  const tickerWines = [...wines, ...wines];

  return (
    <div
      className="w-full overflow-hidden"
      aria-label="Wijnflessen collectie"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex w-max ticker-scroll"
        style={{
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {tickerWines.map((wine, index) => (
          <div
            key={`${wine.id}-${index}`}
            className="flex-shrink-0 w-[200px] md:w-[280px]"
          >
            <WineSpotlightSlide
              name={wine.name}
              slug={wine.slug}
              region={wine.region?.name ?? null}
              vintage={wine.vintage}
              index={index}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
