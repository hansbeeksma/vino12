"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
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
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      skipSnaps: false,
      containScroll: false,
    },
    [
      Autoplay({
        delay: 5000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi],
  );

  return (
    <div className="w-full">
      <div
        className="overflow-hidden cursor-grab active:cursor-grabbing"
        ref={emblaRef}
      >
        <div className="flex">
          {wines.map((wine, index) => (
            <div
              key={wine.id}
              className="flex-[0_0_100%] min-w-0 md:flex-[0_0_60%]"
            >
              <WineSpotlightSlide
                name={wine.name}
                slug={wine.slug}
                region={wine.region?.name ?? null}
                vintage={wine.vintage}
                isActive={index === selectedIndex}
              />
            </div>
          ))}
        </div>
      </div>

      {wines.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {wines.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Ga naar wijn ${index + 1}`}
              onClick={() => scrollTo(index)}
              className={`carousel-dot ${index === selectedIndex ? "carousel-dot-active" : ""}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
