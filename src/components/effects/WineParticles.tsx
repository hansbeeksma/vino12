"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

interface WineParticlesProps {
  className?: string;
  variant?: "hero" | "subtle" | "celebration";
}

export function WineParticles({
  className = "",
  variant = "hero",
}: WineParticlesProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  const options = useMemo<ISourceOptions>(() => {
    if (variant === "celebration") {
      return celebrationConfig;
    }
    if (variant === "subtle") {
      return subtleConfig;
    }
    return heroConfig;
  }, [variant]);

  if (!ready) return null;

  return <Particles className={className} options={options} />;
}

const heroConfig: ISourceOptions = {
  fullScreen: false,
  fpsLimit: 60,
  particles: {
    number: {
      value: 40,
      density: { enable: true, width: 1200, height: 800 },
    },
    color: {
      value: ["#722f37", "#a94a56", "#c9a96e", "#d9a0a7", "#5e262e"],
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: { min: 0.1, max: 0.4 },
      animation: {
        enable: true,
        speed: 0.3,
        sync: false,
      },
    },
    size: {
      value: { min: 1, max: 4 },
      animation: {
        enable: true,
        speed: 1,
        sync: false,
      },
    },
    move: {
      enable: true,
      speed: { min: 0.2, max: 0.8 },
      direction: "none",
      random: true,
      straight: false,
      outModes: { default: "out" },
    },
    links: {
      enable: false,
    },
    wobble: {
      enable: true,
      distance: 10,
      speed: { min: -2, max: 2 },
    },
  },
  interactivity: {
    detectsOn: "window",
    events: {
      onHover: {
        enable: true,
        mode: "grab",
      },
    },
    modes: {
      grab: {
        distance: 120,
        links: {
          opacity: 0.15,
          color: "#722f37",
        },
      },
    },
  },
  detectRetina: true,
};

const subtleConfig: ISourceOptions = {
  fullScreen: false,
  fpsLimit: 30,
  particles: {
    number: {
      value: 15,
      density: { enable: true, width: 1200, height: 800 },
    },
    color: {
      value: ["#722f37", "#c9a96e"],
    },
    shape: { type: "circle" },
    opacity: {
      value: { min: 0.05, max: 0.2 },
      animation: { enable: true, speed: 0.2, sync: false },
    },
    size: {
      value: { min: 1, max: 3 },
    },
    move: {
      enable: true,
      speed: { min: 0.1, max: 0.4 },
      direction: "none",
      random: true,
      straight: false,
      outModes: { default: "out" },
    },
    links: { enable: false },
  },
  interactivity: {
    events: {
      onHover: { enable: false },
    },
  },
  detectRetina: true,
};

const celebrationConfig: ISourceOptions = {
  fullScreen: false,
  fpsLimit: 60,
  particles: {
    number: { value: 0 },
    color: {
      value: ["#722f37", "#c9a96e", "#a94a56", "#fafaf5", "#00674f"],
    },
    shape: {
      type: ["circle", "square"],
    },
    opacity: {
      value: { min: 0.4, max: 1 },
      animation: {
        enable: true,
        speed: 1,
        startValue: "max",
        destroy: "min",
      },
    },
    size: {
      value: { min: 2, max: 6 },
    },
    move: {
      enable: true,
      speed: { min: 5, max: 15 },
      direction: "none",
      random: true,
      straight: false,
      outModes: { default: "destroy" },
      gravity: {
        enable: true,
        acceleration: 5,
      },
    },
    rotate: {
      value: { min: 0, max: 360 },
      animation: { enable: true, speed: 30 },
    },
    life: {
      count: 1,
      duration: { value: { min: 1, max: 3 } },
    },
  },
  emitters: {
    position: { x: 50, y: 30 },
    rate: { quantity: 10, delay: 0.1 },
    life: {
      count: 3,
      duration: 0.5,
      delay: 0.2,
    },
    size: {
      width: 60,
      height: 10,
    },
  },
  detectRetina: true,
};
