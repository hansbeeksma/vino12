"use client";

import { lazy, Suspense } from "react";
import { FeatureFlag } from "@/components/ui/FeatureFlag";

const CelebrationBurst = lazy(() =>
  import("@/components/effects/CelebrationBurst").then((m) => ({
    default: m.CelebrationBurst,
  })),
);

export function SuccessCelebration() {
  return (
    <FeatureFlag flag="effects.celebration">
      <Suspense fallback={null}>
        <CelebrationBurst className="z-20" />
      </Suspense>
    </FeatureFlag>
  );
}
