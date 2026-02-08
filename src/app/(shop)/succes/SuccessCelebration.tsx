"use client";

import { lazy, Suspense } from "react";

const CelebrationBurst = lazy(() =>
  import("@/components/effects/CelebrationBurst").then((m) => ({
    default: m.CelebrationBurst,
  })),
);

export function SuccessCelebration() {
  return (
    <Suspense fallback={null}>
      <CelebrationBurst className="z-20" />
    </Suspense>
  );
}
