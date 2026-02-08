import { useFeature as useGBFeature } from "@growthbook/growthbook-react";

/**
 * Custom hook for type-safe feature flag access
 *
 * Usage:
 * ```tsx
 * const showNewCheckout = useFeature("new-checkout-flow", false);
 * const recommendationCount = useFeature("recommendation-count", 6);
 * ```
 */
export function useFeature<T = boolean>(key: string, defaultValue: T): T {
  const feature = useGBFeature(key);

  if (!feature.on) {
    return defaultValue;
  }

  return (feature.value as T) ?? defaultValue;
}

/**
 * Feature flag keys (for type safety and autocomplete)
 */
export const FeatureFlags = {
  // Homepage
  NEW_HOMEPAGE_HERO: "new-homepage-hero",
  SHOW_WINE_CLUB_CTA: "show-wine-club-cta",

  // Checkout
  NEW_CHECKOUT_FLOW: "new-checkout-flow",
  ENABLE_EXPRESS_CHECKOUT: "enable-express-checkout",

  // Recommendations
  RECOMMENDATION_COUNT: "recommendation-count",
  ENABLE_AI_SOMMELIER: "enable-ai-sommelier",

  // Analytics
  ENABLE_DETAILED_TRACKING: "enable-detailed-tracking",

  // MAWCM Experiment (first A/B test!)
  MAWCM_EXPERIMENT_CTA: "mawcm-experiment-cta",
} as const;

export type FeatureFlagKey = (typeof FeatureFlags)[keyof typeof FeatureFlags];
