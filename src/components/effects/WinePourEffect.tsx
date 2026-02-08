"use client";

import { useEffect, useRef, useState } from "react";

interface WinePourEffectProps {
  className?: string;
  color?: string;
  active?: boolean;
}

const WINE_COLORS = ["#722f37", "#8b3a42", "#a94a56", "#5e262e", "#4a1e25"];

/**
 * Proton.js-based liquid pour particle effect.
 * Simulates wine being poured with gravity, splash, and drip particles.
 */
export function WinePourEffect({
  className = "",
  color = "#722f37",
  active = true,
}: WinePourEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!active || reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let protonInstance: ProtonEngine | null = null;

    async function initProton() {
      try {
        const Proton = (await import("proton-engine")).default;

        const width = canvas!.offsetWidth;
        const height = canvas!.offsetHeight;
        canvas!.width = width * window.devicePixelRatio;
        canvas!.height = height * window.devicePixelRatio;
        ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);

        const proton = new Proton();
        protonInstance = proton as ProtonEngine;

        // Main pour stream - a continuous stream of droplets
        const pourEmitter = new Proton.Emitter();
        pourEmitter.rate = new Proton.Rate(
          new Proton.Span(3, 6),
          new Proton.Span(0.02, 0.05),
        );

        pourEmitter.addInitialize(
          new Proton.Mass(1),
          new Proton.Radius(2, 5),
          new Proton.Life(1.5, 2.5),
          new Proton.Velocity(
            new Proton.Span(0.5, 1.5),
            new Proton.Span(170, 190),
            "polar",
          ),
        );

        pourEmitter.addBehaviour(
          new Proton.Gravity(3),
          new Proton.Alpha(0.8, 0.1),
          new Proton.Scale(1, 0.3),
          new Proton.Color(color, pickRandom(WINE_COLORS)),
        );

        pourEmitter.p.x = width * 0.5;
        pourEmitter.p.y = height * 0.1;
        pourEmitter.emit();
        proton.addEmitter(pourEmitter);

        // Splash emitter at the bottom - particles that spray on impact
        const splashEmitter = new Proton.Emitter();
        splashEmitter.rate = new Proton.Rate(
          new Proton.Span(2, 4),
          new Proton.Span(0.05, 0.1),
        );

        splashEmitter.addInitialize(
          new Proton.Mass(0.5),
          new Proton.Radius(1, 3),
          new Proton.Life(0.3, 0.8),
          new Proton.Velocity(
            new Proton.Span(1, 3),
            new Proton.Span(120, 240),
            "polar",
          ),
        );

        splashEmitter.addBehaviour(
          new Proton.Gravity(2),
          new Proton.Alpha(0.6, 0),
          new Proton.Scale(0.8, 0.1),
          new Proton.Color(color, pickRandom(WINE_COLORS)),
        );

        splashEmitter.p.x = width * 0.5;
        splashEmitter.p.y = height * 0.75;
        splashEmitter.emit();
        proton.addEmitter(splashEmitter);

        // Mist / aroma particles that float upward
        const mistEmitter = new Proton.Emitter();
        mistEmitter.rate = new Proton.Rate(
          new Proton.Span(1, 2),
          new Proton.Span(0.2, 0.4),
        );

        mistEmitter.addInitialize(
          new Proton.Mass(0.1),
          new Proton.Radius(8, 16),
          new Proton.Life(2, 4),
          new Proton.Velocity(
            new Proton.Span(0.1, 0.3),
            new Proton.Span(-10, 10),
            "polar",
          ),
        );

        mistEmitter.addBehaviour(
          new Proton.Gravity(-0.3),
          new Proton.Alpha(0.05, 0),
          new Proton.Scale(0.5, 2),
          new Proton.Color("#c9a96e", "#d9a0a7"),
          new Proton.RandomDrift(0.5, 0.5, 0.1),
        );

        mistEmitter.p.x = width * 0.5;
        mistEmitter.p.y = height * 0.7;
        mistEmitter.emit();
        proton.addEmitter(mistEmitter);

        // Canvas renderer
        const renderer = new Proton.CanvasRenderer(canvas);
        proton.addRenderer(renderer);

        // Animation loop
        function animate() {
          ctx!.clearRect(0, 0, width, height);
          proton.update();
          animRef.current = requestAnimationFrame(animate);
        }
        animate();
      } catch {
        // Proton failed to load
      }
    }

    initProton();

    return () => {
      cancelAnimationFrame(animRef.current);
      if (protonInstance) {
        (protonInstance as { destroy?: () => void }).destroy?.();
      }
    };
  }, [active, color, reducedMotion]);

  if (reducedMotion || !active) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Minimal type for cleanup
interface ProtonEngine {
  update: () => void;
  destroy?: () => void;
  addEmitter: (emitter: unknown) => void;
  addRenderer: (renderer: unknown) => void;
}
