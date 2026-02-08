"use client";

import { useEffect, useRef, useCallback } from "react";
import mojs from "@mojs/core";

interface CelebrationBurstProps {
  trigger?: boolean;
  className?: string;
}

export function CelebrationBurst({
  trigger = true,
  className = "",
}: CelebrationBurstProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<InstanceType<typeof mojs.Timeline> | null>(null);
  const hasPlayed = useRef(false);

  const createBurst = useCallback(() => {
    if (!containerRef.current || timelineRef.current) return;

    const WINE_COLORS = ["#722f37", "#a94a56", "#c9a96e", "#5e262e", "#d9a0a7"];
    const GOLD = "#c9a96e";

    // Main burst - wine cork pop
    const mainBurst = new mojs.Burst({
      parent: containerRef.current,
      radius: { 0: 150 },
      count: 16,
      children: {
        shape: "circle",
        fill: WINE_COLORS,
        radius: { 8: 0 },
        strokeWidth: 2,
        stroke: WINE_COLORS,
        duration: 1500,
        delay: "stagger(0, 50)",
        easing: "cubic.out",
      },
    });

    // Secondary ring burst
    const ringBurst = new mojs.Burst({
      parent: containerRef.current,
      radius: { 0: 100 },
      count: 8,
      children: {
        shape: "rect",
        fill: "none",
        stroke: WINE_COLORS,
        strokeWidth: { 3: 0 },
        radius: { 12: 0 },
        duration: 1200,
        delay: "stagger(100, 80)",
        easing: "cubic.out",
      },
    });

    // Sparkle ring
    const sparkleBurst = new mojs.Burst({
      parent: containerRef.current,
      radius: { 20: 120 },
      count: 12,
      children: {
        shape: "cross",
        fill: GOLD,
        radius: { 6: 0 },
        rotate: { 0: 180 },
        duration: 1800,
        delay: "stagger(200, 40)",
        easing: "sine.out",
      },
    });

    // Central circle ripple
    const circle = new mojs.Shape({
      parent: containerRef.current,
      shape: "circle",
      fill: "none",
      stroke: "#722f37",
      strokeWidth: { 20: 0 },
      radius: { 0: 80 },
      opacity: { 1: 0 },
      duration: 1000,
      easing: "cubic.out",
    });

    // Wine emoji shape (decorative circle)
    const wineCircle = new mojs.Shape({
      parent: containerRef.current,
      shape: "circle",
      fill: "#722f37",
      radius: { 0: 20, curve: "elastic.out" },
      duration: 800,
      delay: 300,
    });

    timelineRef.current = new mojs.Timeline();
    timelineRef.current.add(
      mainBurst,
      ringBurst,
      sparkleBurst,
      circle,
      wineCircle,
    );
  }, []);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    createBurst();

    if (trigger && !hasPlayed.current && timelineRef.current) {
      const timer = setTimeout(() => {
        timelineRef.current?.replay();
        hasPlayed.current = true;
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [trigger, createBurst]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
}
