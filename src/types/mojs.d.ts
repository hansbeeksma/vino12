declare module "@mojs/core" {
  interface ShapeOptions {
    parent?: HTMLElement;
    shape?: string;
    fill?: string | string[];
    stroke?: string | string[];
    strokeWidth?: number | Record<string, unknown>;
    radius?: number | Record<string, unknown>;
    rotate?: number | Record<string, unknown>;
    opacity?: number | Record<string, unknown>;
    duration?: number;
    delay?: number | string;
    easing?: string;
    [key: string]: unknown;
  }

  interface BurstOptions extends ShapeOptions {
    count?: number;
    children?: ShapeOptions;
    [key: string]: unknown;
  }

  class Shape {
    constructor(options?: ShapeOptions);
    play(): Shape;
    replay(): Shape;
  }

  class Burst {
    constructor(options?: BurstOptions);
    play(): Burst;
    replay(): Burst;
  }

  class Timeline {
    add(...items: (Shape | Burst | Timeline)[]): Timeline;
    play(): Timeline;
    replay(): Timeline;
  }

  const mojs: {
    Shape: typeof Shape;
    Burst: typeof Burst;
    Timeline: typeof Timeline;
  };

  export default mojs;
}
