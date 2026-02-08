declare module "proton-engine" {
  class Span {
    constructor(a: number, b?: number);
  }

  class Rate {
    constructor(numPan: Span, timePan: Span);
  }

  class Mass {
    constructor(value: number);
  }

  class Radius {
    constructor(a: number, b?: number);
  }

  class Life {
    constructor(a: number, b?: number);
  }

  class Velocity {
    constructor(span: Span, dirSpan: Span, type?: string);
  }

  class Gravity {
    constructor(value: number);
  }

  class Alpha {
    constructor(from: number, to?: number);
  }

  class Scale {
    constructor(from: number, to?: number);
  }

  class Color {
    constructor(from: string, to?: string);
  }

  class RandomDrift {
    constructor(x: number, y: number, delay?: number);
  }

  class Emitter {
    rate: Rate;
    p: { x: number; y: number };
    addInitialize(...initializers: unknown[]): void;
    addBehaviour(...behaviours: unknown[]): void;
    emit(totalEmitTimes?: number, life?: number): void;
    stop(): void;
  }

  class CanvasRenderer {
    constructor(canvas: HTMLCanvasElement | null);
  }

  class Proton {
    constructor();
    addEmitter(emitter: Emitter): void;
    addRenderer(renderer: CanvasRenderer): void;
    update(): void;
    destroy(): void;
    static Rate: typeof Rate;
    static Span: typeof Span;
    static Mass: typeof Mass;
    static Radius: typeof Radius;
    static Life: typeof Life;
    static Velocity: typeof Velocity;
    static Gravity: typeof Gravity;
    static Alpha: typeof Alpha;
    static Scale: typeof Scale;
    static Color: typeof Color;
    static RandomDrift: typeof RandomDrift;
    static Emitter: typeof Emitter;
    static CanvasRenderer: typeof CanvasRenderer;
  }

  export default Proton;
}
