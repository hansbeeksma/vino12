"use client";

import { useRef, useEffect } from "react";
import { useReducedMotion } from "motion/react";
import Granim from "granim";

interface HeroGradientProps {
  className?: string;
}

export function HeroGradient({ className = "" }: HeroGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const granimRef = useRef<Granim | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!canvasRef.current || prefersReducedMotion) return;

    granimRef.current = new Granim({
      element: canvasRef.current,
      direction: "diagonal",
      isPausedWhenNotInView: true,
      stateTransitionSpeed: 4000,
      defaultStateName: "light",
      states: {
        light: {
          gradients: [
            ["#F4C2C2", "#D4AF37"],
            ["#fbf2e3", "#e6c54a"],
          ],
          transitionSpeed: 6000,
        },
        medium: {
          gradients: [
            ["#C74B3A", "#722F37"],
            ["#a94a56", "#660033"],
          ],
          transitionSpeed: 5000,
        },
        full: {
          gradients: [
            ["#8B0000", "#4B0000"],
            ["#722F37", "#40310f"],
          ],
          transitionSpeed: 7000,
        },
      },
    });

    return () => {
      granimRef.current?.destroy();
      granimRef.current = null;
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div
        className={className}
        style={{ backgroundColor: "rgba(244, 194, 194, 0.15)" }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
