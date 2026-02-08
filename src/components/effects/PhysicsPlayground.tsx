"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Matter from "matter-js";

interface PhysicsPlaygroundProps {
  className?: string;
}

const WINE_PALETTE = [
  "#722f37", // wine
  "#a94a56", // wine-400
  "#c9a96e", // champagne/gold
  "#5e262e", // wine-600
  "#00674f", // emerald
  "#d9a0a7", // rosé
];

/**
 * Matter.js physics playground with interactive wine-themed objects.
 * Click to drop grapes, corks, and wine drops that bounce and interact.
 */
export function PhysicsPlayground({ className = "" }: PhysicsPlaygroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
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

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!engineRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const color = WINE_PALETTE[Math.floor(Math.random() * WINE_PALETTE.length)];
    const type = Math.random();

    let body: Matter.Body;

    if (type < 0.4) {
      // Grape (circle)
      body = Matter.Bodies.circle(x, y, 8 + Math.random() * 6, {
        restitution: 0.7,
        friction: 0.3,
        render: { fillStyle: color },
      });
    } else if (type < 0.7) {
      // Cork (rounded rectangle)
      body = Matter.Bodies.rectangle(
        x,
        y,
        12 + Math.random() * 8,
        24 + Math.random() * 10,
        {
          restitution: 0.4,
          friction: 0.5,
          chamfer: { radius: 4 },
          render: { fillStyle: "#c9a96e" },
        },
      );
    } else {
      // Wine drop (small circle)
      body = Matter.Bodies.circle(x, y, 4 + Math.random() * 3, {
        restitution: 0.5,
        friction: 0.1,
        density: 0.002,
        render: { fillStyle: "#722f37" },
      });
    }

    // Add slight random velocity
    Matter.Body.setVelocity(body, {
      x: (Math.random() - 0.5) * 3,
      y: Math.random() * -3,
    });

    Matter.Composite.add(engineRef.current.world, body);

    // Remove after 10 seconds to prevent buildup
    setTimeout(() => {
      if (engineRef.current) {
        Matter.Composite.remove(engineRef.current.world, body);
      }
    }, 10000);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    // Create engine
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1, scale: 0.001 },
    });
    engineRef.current = engine;

    // Create renderer
    const render = Matter.Render.create({
      canvas,
      engine,
      options: {
        width,
        height,
        wireframes: false,
        background: "transparent",
        pixelRatio: window.devicePixelRatio,
      },
    });
    renderRef.current = render;

    // Walls
    const wallOptions: Matter.IChamferableBodyDefinition = {
      isStatic: true,
      render: { visible: false },
    };

    const walls = [
      // Floor
      Matter.Bodies.rectangle(
        width / 2,
        height + 25,
        width + 100,
        50,
        wallOptions,
      ),
      // Left wall
      Matter.Bodies.rectangle(-25, height / 2, 50, height, wallOptions),
      // Right wall
      Matter.Bodies.rectangle(width + 25, height / 2, 50, height, wallOptions),
    ];

    Matter.Composite.add(engine.world, walls);

    // Add some initial decorative bodies
    const initialBodies = [];
    for (let i = 0; i < 5; i++) {
      const x = width * 0.2 + Math.random() * width * 0.6;
      const grape = Matter.Bodies.circle(x, -20 - Math.random() * 100, 10, {
        restitution: 0.6,
        friction: 0.3,
        render: {
          fillStyle:
            WINE_PALETTE[Math.floor(Math.random() * WINE_PALETTE.length)],
        },
      });
      initialBodies.push(grape);
    }
    Matter.Composite.add(engine.world, initialBodies);

    // Mouse interaction
    const mouse = Matter.Mouse.create(canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });
    Matter.Composite.add(engine.world, mouseConstraint);

    // Keep mouse in sync with rendering
    render.mouse = mouse;

    // Run
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Render.run(render);
    Matter.Runner.run(runner, engine);

    // Resize handler
    const handleResize = () => {
      const newWidth = container.offsetWidth;
      const newHeight = container.offsetHeight;
      render.canvas.width = newWidth * window.devicePixelRatio;
      render.canvas.height = newHeight * window.devicePixelRatio;
      render.options.width = newWidth;
      render.options.height = newHeight;

      // Update floor position
      Matter.Body.setPosition(walls[0], {
        x: newWidth / 2,
        y: newHeight + 25,
      });
      Matter.Body.setPosition(walls[2], {
        x: newWidth + 25,
        y: newHeight / 2,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      engineRef.current = null;
      renderRef.current = null;
      runnerRef.current = null;
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className="font-accent text-xs uppercase tracking-widest text-ink/30">
          Interactief speelveld
        </span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        className="w-full h-full cursor-crosshair"
        aria-label="Interactief physics speelveld - klik om wijn-objecten te laten vallen"
        role="img"
      />
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
        <span className="font-accent text-[10px] uppercase tracking-widest text-ink/30">
          Klik om te spelen
        </span>
      </div>
    </div>
  );
}
