"use client";

import { useState, useCallback } from "react";
import type { WineRow } from "@/lib/api/wines";
import { StorySlide } from "@/components/instagram/StorySlide";
import { StoryProgressBar } from "@/components/instagram/StoryProgressBar";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface StoriesCarouselProps {
  wines: WineRow[];
}

export function StoriesCarousel({ wines }: StoriesCarouselProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    if (current < wines.length - 1) {
      setCurrent((c) => c + 1);
    }
  }, [current, wines.length]);

  const prev = useCallback(() => {
    if (current > 0) {
      setCurrent((c) => c - 1);
    }
  }, [current]);

  const handleTap = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      if (x < rect.width / 2) {
        prev();
      } else {
        next();
      }
    },
    [next, prev],
  );

  if (wines.length === 0) return null;

  return (
    <section className="section-padding bg-ink">
      <div className="container-brutal">
        <SectionLabel className="text-champagne/60!">
          Instagram Stories
        </SectionLabel>
        <h2 className="font-display text-display-md text-champagne mb-8">
          SWIPE DOOR
          <br />
          <span className="text-wine">ONZE WIJNEN.</span>
        </h2>
      </div>

      <div className="flex justify-center px-4">
        <div
          className="w-full max-w-[375px] md:max-w-[430px] border-brutal-lg border-champagne/20 bg-ink relative overflow-hidden"
          style={{ height: "min(80vh, 760px)" }}
        >
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 z-20 p-3">
            <StoryProgressBar total={wines.length} current={current} />
            <div className="flex items-center gap-2 mt-2">
              <div className="w-6 h-6 border border-champagne/50 flex items-center justify-center">
                <span className="font-accent text-[8px] text-champagne">
                  V12
                </span>
              </div>
              <span className="font-accent text-[10px] text-champagne/70 uppercase tracking-widest">
                vino12
              </span>
            </div>
          </div>

          {/* Tap zones */}
          <div
            className="absolute inset-0 z-10 cursor-pointer"
            onClick={handleTap}
          />

          {/* Slide content with CSS transition */}
          <div className="absolute inset-0 pt-16 transition-opacity duration-200">
            <StorySlide wine={wines[current]} />
          </div>

          {/* Navigation dots */}
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-1">
            <span className="font-accent text-[10px] text-champagne/40">
              {current + 1} / {wines.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
