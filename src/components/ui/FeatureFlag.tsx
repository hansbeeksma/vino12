"use client";

import type { ReactNode } from "react";
import { isFeatureEnabled, type FeatureFlags } from "@/lib/feature-flags";

interface FeatureFlagProps {
  flag: keyof FeatureFlags;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Conditionally render children based on feature flag status.
 *
 * Unlike FeatureGate (browser capability), FeatureFlag checks
 * business/tier feature flags from the Neural Net analysis.
 *
 * @example
 * <FeatureFlag flag="ar.enabled" fallback={null}>
 *   <ARSceneViewer />
 * </FeatureFlag>
 */
export function FeatureFlag({
  flag,
  children,
  fallback = null,
}: FeatureFlagProps) {
  if (!isFeatureEnabled(flag)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
