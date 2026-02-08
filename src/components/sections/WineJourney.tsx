"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { types } from "@theatre/core";
import type { ISheetObject } from "@theatre/core";
import type { WineRow } from "@/lib/api/wines";
import { useScroll, useTransform } from "motion/react";
import { bodyLabel } from "@/lib/utils";
import { bodyColor } from "@/lib/wine-colors";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { useTheatreScroll } from "@/components/motion/useTheatreScroll";
import { getTheatreProject, initTheatreStudio } from "@/lib/theatre";

interface WineJourneyProps {
  wines: WineRow[];
}

interface AnimationParams {
  staggerDelay: number;
  animDuration: number;
  yOffset: number;
  scaleFrom: number;
  lineDelay: number;
}

const DEFAULT_PARAMS: AnimationParams = {
  staggerDelay: 0.06,
  animDuration: 0.12,
  yOffset: 30,
  scaleFrom: 0.85,
  lineDelay: 0.03,
};

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function getNodeStyle(
  index: number,
  scrollProgress: number,
  params: AnimationParams,
): React.CSSProperties {
  const nodeStart = 0.15 + index * params.staggerDelay;
  const raw = (scrollProgress - nodeStart) / params.animDuration;
  const nodeProgress = Math.max(0, Math.min(1, raw));
  const eased = easeOutCubic(nodeProgress);

  return {
    opacity: eased,
    transform: `translateY(${params.yOffset * (1 - eased)}px) scale(${lerp(params.scaleFrom, 1, eased)})`,
    transition: "none",
  };
}

function getLineStyle(
  index: number,
  scrollProgress: number,
  params: AnimationParams,
): React.CSSProperties {
  const lineStart =
    0.15 + (index + 0.5) * params.staggerDelay + params.lineDelay;
  const raw = (scrollProgress - lineStart) / params.animDuration;
  const lineProgress = Math.max(0, Math.min(1, raw));
  const eased = easeOutCubic(lineProgress);

  return {
    transform: `scaleX(${eased})`,
    transformOrigin: "left",
    transition: "none",
  };
}

export function WineJourney({ wines }: WineJourneyProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { progress } = useTheatreScroll(sectionRef);
  const [params, setParams] = useState<AnimationParams>(DEFAULT_PARAMS);
  const theatreObjRef = useRef<ISheetObject<typeof theatreProps> | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["#fbf2e3", "#f7e6ca", "#f0d4d7"],
  );

  const reds = wines.filter((w) => w.type === "red");
  const whites = wines.filter((w) => w.type === "white");

  // Check prefers-reduced-motion
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Initialize Theatre.js (dev Studio + editable params)
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const project = getTheatreProject();
      const sheet = project.sheet("WineJourney");
      const obj = sheet.object("animationConfig", theatreProps);
      theatreObjRef.current = obj;

      const unsub = obj.onValuesChange((values) => {
        setParams(values as AnimationParams);
      });

      // Load Studio in development for visual editing
      initTheatreStudio();

      return unsub;
    } catch {
      // Theatre.js initialization failed, use defaults
    }
  }, []);

  const getNodeAnimStyle = useCallback(
    (index: number): React.CSSProperties => {
      if (reducedMotion) return { opacity: 1, transform: "none" };
      return getNodeStyle(index, progress, params);
    },
    [progress, params, reducedMotion],
  );

  const getLineAnimStyle = useCallback(
    (index: number): React.CSSProperties => {
      if (reducedMotion) return { transform: "scaleX(1)" };
      return getLineStyle(index, progress, params);
    },
    [progress, params, reducedMotion],
  );

  const sectionBgStyle = reducedMotion
    ? { backgroundColor: "#f7e6ca" }
    : { backgroundColor: bgColor as unknown as string };

  return (
    <section
      ref={sectionRef}
      id="reis"
      className="section-padding border-y-brutal border-ink"
      style={sectionBgStyle}
    >
      <div className="container-brutal">
        <AnimatedSection>
          <SectionLabel>De Wijnreis</SectionLabel>
          <h2 className="font-display text-display-md text-ink mb-4">
            VAN LICHT
            <br />
            <span className="text-wine">NAAR VOL.</span>
          </h2>
          <p className="font-body text-xl text-ink/70 max-w-lg mb-8">
            Elke box vertelt een verhaal. Van delicate Pinot Noir tot krachtige
            Cabernet Sauvignon. Van frisse Sauvignon Blanc tot weelderige
            Viognier.
          </p>
        </AnimatedSection>
      </div>

      <div ref={scrollRef} className="overflow-x-auto scrollbar-hide pb-4">
        <div className="flex gap-0 min-w-max px-4 md:px-8">
          <div className="flex flex-col">
            <div className="flex items-center gap-0">
              {reds.map((wine, i) => (
                <div key={wine.id} className="flex items-center">
                  <a
                    href={`/wijn/${wine.slug}`}
                    className="flex flex-col items-center w-32 md:w-40 group"
                    style={getNodeAnimStyle(i)}
                  >
                    <div className="w-12 h-12 border-brutal border-ink bg-offwhite brutal-shadow brutal-hover flex items-center justify-center">
                      <div
                        className="w-6 h-6 border border-ink"
                        style={{
                          backgroundColor: bodyColor(wine.type, wine.body),
                        }}
                      />
                    </div>
                    <div className="mt-3 text-center">
                      <p className="font-display text-xs font-bold leading-tight">
                        {wine.name}
                      </p>
                      {wine.region && (
                        <p className="font-accent text-[9px] uppercase tracking-widest text-ink/50 mt-0.5">
                          {wine.region.name}
                        </p>
                      )}
                      <p className="font-accent text-[9px] uppercase tracking-widest text-wine mt-0.5">
                        {bodyLabel(wine.body)}
                      </p>
                    </div>
                  </a>
                  {i < reds.length - 1 && (
                    <div
                      className="w-8 h-0.5 bg-wine/30 -mt-8 md:-mt-10"
                      style={getLineAnimStyle(i)}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 pl-4">
              <div className="w-3 h-3 bg-wine border border-ink" />
              <span className="font-accent text-[10px] uppercase tracking-widest text-ink/50">
                Rood — Licht → Vol
              </span>
            </div>
          </div>

          <div className="w-8 md:w-16 flex items-center justify-center">
            <div className="w-px h-24 bg-ink/20" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-0">
              {whites.map((wine, i) => (
                <div key={wine.id} className="flex items-center">
                  <a
                    href={`/wijn/${wine.slug}`}
                    className="flex flex-col items-center w-32 md:w-40 group"
                    style={getNodeAnimStyle(reds.length + i)}
                  >
                    <div className="w-12 h-12 border-brutal border-ink bg-offwhite brutal-shadow brutal-hover flex items-center justify-center">
                      <div
                        className="w-6 h-6 border border-ink"
                        style={{
                          backgroundColor: bodyColor(wine.type, wine.body),
                        }}
                      />
                    </div>
                    <div className="mt-3 text-center">
                      <p className="font-display text-xs font-bold leading-tight">
                        {wine.name}
                      </p>
                      {wine.region && (
                        <p className="font-accent text-[9px] uppercase tracking-widest text-ink/50 mt-0.5">
                          {wine.region.name}
                        </p>
                      )}
                      <p className="font-accent text-[9px] uppercase tracking-widest text-emerald mt-0.5">
                        {bodyLabel(wine.body)}
                      </p>
                    </div>
                  </a>
                  {i < whites.length - 1 && (
                    <div
                      className="w-8 h-0.5 bg-emerald/30 -mt-8 md:-mt-10"
                      style={getLineAnimStyle(reds.length + i)}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 pl-4">
              <div className="w-3 h-3 bg-emerald border border-ink" />
              <span className="font-accent text-[10px] uppercase tracking-widest text-ink/50">
                Wit — Licht → Vol
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Theatre.js editable animation parameters
// These can be tweaked in real-time via Theatre.js Studio (dev mode)
const theatreProps = {
  staggerDelay: types.number(DEFAULT_PARAMS.staggerDelay, {
    range: [0, 0.3],
    nudgeMultiplier: 0.01,
  }),
  animDuration: types.number(DEFAULT_PARAMS.animDuration, {
    range: [0.05, 0.5],
    nudgeMultiplier: 0.01,
  }),
  yOffset: types.number(DEFAULT_PARAMS.yOffset, {
    range: [0, 100],
    nudgeMultiplier: 1,
  }),
  scaleFrom: types.number(DEFAULT_PARAMS.scaleFrom, {
    range: [0, 1],
    nudgeMultiplier: 0.01,
  }),
  lineDelay: types.number(DEFAULT_PARAMS.lineDelay, {
    range: [0, 0.2],
    nudgeMultiplier: 0.01,
  }),
};
