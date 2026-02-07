import type { BottleShape } from "@/lib/types";

interface BottleSilhouetteProps {
  shape: BottleShape;
  color: string;
  className?: string;
}

function BordeauxPath() {
  return (
    <svg viewBox="0 0 80 280" className="h-full w-auto" fill="currentColor">
      <rect x="34" y="0" width="12" height="8" />
      <rect x="32" y="8" width="16" height="55" />
      <rect x="28" y="63" width="24" height="6" />
      <path d="M28 69 L12 95 L68 95 L52 69 Z" />
      <rect x="12" y="95" width="56" height="160" />
      <rect x="8" y="255" width="64" height="8" />
      <rect x="12" y="263" width="56" height="4" />
    </svg>
  );
}

function BourgognePath() {
  return (
    <svg viewBox="0 0 80 280" className="h-full w-auto" fill="currentColor">
      <rect x="34" y="0" width="12" height="8" />
      <rect x="33" y="8" width="14" height="60" />
      <rect x="30" y="68" width="20" height="5" />
      <path d="M30 73 Q30 73 28 85 Q22 105 14 130 L66 130 Q58 105 52 85 Q50 73 50 73 Z" />
      <path d="M14 130 L12 245 L68 245 L66 130 Z" />
      <rect x="8" y="245" width="64" height="8" />
      <rect x="10" y="253" width="60" height="4" />
    </svg>
  );
}

function RhonePath() {
  return (
    <svg viewBox="0 0 80 280" className="h-full w-auto" fill="currentColor">
      <rect x="34" y="0" width="12" height="8" />
      <rect x="32" y="8" width="16" height="50" />
      <rect x="28" y="58" width="24" height="6" />
      <path d="M28 64 Q20 85 10 115 L70 115 Q60 85 52 64 Z" />
      <rect x="10" y="115" width="60" height="30" />
      <path d="M10 145 L12 248 L68 248 L70 145 Z" />
      <rect x="8" y="248" width="64" height="8" />
      <rect x="10" y="256" width="60" height="4" />
    </svg>
  );
}

function FlutePath() {
  return (
    <svg viewBox="0 0 60 300" className="h-full w-auto" fill="currentColor">
      <rect x="24" y="0" width="12" height="8" />
      <rect x="23" y="8" width="14" height="80" />
      <rect x="20" y="88" width="20" height="5" />
      <path d="M20 93 Q16 110 14 135 L46 135 Q44 110 40 93 Z" />
      <path d="M14 135 L13 268 L47 268 L46 135 Z" />
      <rect x="10" y="268" width="40" height="6" />
      <rect x="12" y="274" width="36" height="4" />
    </svg>
  );
}

const shapeComponents: Record<BottleShape, () => JSX.Element> = {
  bordeaux: BordeauxPath,
  bourgogne: BourgognePath,
  rhone: RhonePath,
  flute: FlutePath,
};

export function BottleSilhouette({ shape, color, className = "" }: BottleSilhouetteProps) {
  const ShapeComponent = shapeComponents[shape];

  return (
    <div className={className} style={{ color }}>
      <ShapeComponent />
    </div>
  );
}
