/**
 * Feature Flag Configuration — VINO12
 *
 * Based on Neural Net Cross-Industry Success Mapping analysis.
 * Features are tiered by commercial impact:
 *
 * - Tier 1 (Essential): Always ON — core commerce
 * - Tier 2 (High Value): Always ON — proven retention drivers
 * - Tier 3 (Nice-to-Have): OFF at launch, ON at scale (>500 klanten)
 * - Tier 4 (Over-Engineered): OFF — unproven ROI, enable per experiment
 *
 * Override via env: NEXT_PUBLIC_FF_<FLAG_NAME>=true|false
 */

export interface FeatureFlags {
  // Tier 1: Essential (always ON)
  readonly "shop.enabled": boolean;
  readonly "checkout.enabled": boolean;
  readonly "payments.mollie": boolean;
  readonly "age.gate": boolean;
  readonly "seo.structured_data": boolean;
  readonly "email.resend": boolean;
  readonly "gdpr.compliance": boolean;

  // Tier 2: High Value (ON at launch)
  readonly "reviews.enabled": boolean;
  readonly "search.advanced": boolean;
  readonly "wineclub.enabled": boolean;
  readonly "recommendations.enabled": boolean;
  readonly "account.enabled": boolean;
  readonly "wishlist.enabled": boolean;
  readonly "pairings.enabled": boolean;

  // Tier 3: Nice-to-Have (OFF at launch, ON at >500 klanten)
  readonly "gamification.enabled": boolean;
  readonly "social.proof": boolean;
  readonly "leaderboard.enabled": boolean;
  readonly "three.bottles": boolean;
  readonly "effects.particles": boolean;
  readonly "effects.cursor_trail": boolean;
  readonly "effects.celebration": boolean;
  readonly "effects.hero_gradient": boolean;
  readonly "instagram.stories": boolean;

  // Tier 4: Over-Engineered (OFF — unproven ROI)
  readonly "ar.enabled": boolean;
  readonly "cv.scanner": boolean;
  readonly "voice.enabled": boolean;
  readonly "blockchain.enabled": boolean;
  readonly "admin.creative": boolean;
  readonly "admin.ideas": boolean;
  readonly "whatsapp.webhook": boolean;
}

type FeatureFlagKey = keyof FeatureFlags;

/**
 * Default feature flags for launch.
 * Tier 1+2: ON, Tier 3+4: OFF
 */
const LAUNCH_DEFAULTS: FeatureFlags = {
  // Tier 1: Essential
  "shop.enabled": true,
  "checkout.enabled": true,
  "payments.mollie": true,
  "age.gate": true,
  "seo.structured_data": true,
  "email.resend": true,
  "gdpr.compliance": true,

  // Tier 2: High Value
  "reviews.enabled": true,
  "search.advanced": true,
  "wineclub.enabled": true,
  "recommendations.enabled": true,
  "account.enabled": true,
  "wishlist.enabled": true,
  "pairings.enabled": true,

  // Tier 3: Nice-to-Have (OFF at launch)
  "gamification.enabled": false,
  "social.proof": false,
  "leaderboard.enabled": false,
  "three.bottles": false,
  "effects.particles": false,
  "effects.cursor_trail": false,
  "effects.celebration": false,
  "effects.hero_gradient": false,
  "instagram.stories": false,

  // Tier 4: Over-Engineered (OFF)
  "ar.enabled": false,
  "cv.scanner": false,
  "voice.enabled": false,
  "blockchain.enabled": false,
  "admin.creative": false,
  "admin.ideas": false,
  "whatsapp.webhook": false,
};

/**
 * Convert flag key to env var name.
 * "ar.enabled" → "NEXT_PUBLIC_FF_AR_ENABLED"
 */
function flagToEnvVar(flag: FeatureFlagKey): string {
  return `NEXT_PUBLIC_FF_${flag.replace(/\./g, "_").toUpperCase()}`;
}

/**
 * Read a single feature flag.
 * Priority: env override > launch defaults
 */
export function isFeatureEnabled(flag: FeatureFlagKey): boolean {
  const envVar = flagToEnvVar(flag);
  const envValue = process.env[envVar];

  if (envValue !== undefined) {
    return envValue === "true" || envValue === "1";
  }

  return LAUNCH_DEFAULTS[flag];
}

/**
 * Get all feature flags (resolved with env overrides).
 */
export function getFeatureFlags(): FeatureFlags {
  const flags = { ...LAUNCH_DEFAULTS };
  for (const key of Object.keys(flags) as FeatureFlagKey[]) {
    (flags as Record<string, boolean>)[key] = isFeatureEnabled(key);
  }
  return flags;
}

/**
 * Get flags by tier for debugging/admin.
 */
export function getFlagsByTier(): Record<string, Record<string, boolean>> {
  const flags = getFeatureFlags();
  return {
    tier1_essential: {
      "shop.enabled": flags["shop.enabled"],
      "checkout.enabled": flags["checkout.enabled"],
      "payments.mollie": flags["payments.mollie"],
      "age.gate": flags["age.gate"],
      "seo.structured_data": flags["seo.structured_data"],
      "email.resend": flags["email.resend"],
      "gdpr.compliance": flags["gdpr.compliance"],
    },
    tier2_high_value: {
      "reviews.enabled": flags["reviews.enabled"],
      "search.advanced": flags["search.advanced"],
      "wineclub.enabled": flags["wineclub.enabled"],
      "recommendations.enabled": flags["recommendations.enabled"],
      "account.enabled": flags["account.enabled"],
      "wishlist.enabled": flags["wishlist.enabled"],
      "pairings.enabled": flags["pairings.enabled"],
    },
    tier3_nice_to_have: {
      "gamification.enabled": flags["gamification.enabled"],
      "social.proof": flags["social.proof"],
      "leaderboard.enabled": flags["leaderboard.enabled"],
      "three.bottles": flags["three.bottles"],
      "effects.particles": flags["effects.particles"],
      "effects.cursor_trail": flags["effects.cursor_trail"],
      "effects.celebration": flags["effects.celebration"],
      "effects.hero_gradient": flags["effects.hero_gradient"],
      "instagram.stories": flags["instagram.stories"],
    },
    tier4_over_engineered: {
      "ar.enabled": flags["ar.enabled"],
      "cv.scanner": flags["cv.scanner"],
      "voice.enabled": flags["voice.enabled"],
      "blockchain.enabled": flags["blockchain.enabled"],
      "admin.creative": flags["admin.creative"],
      "admin.ideas": flags["admin.ideas"],
      "whatsapp.webhook": flags["whatsapp.webhook"],
    },
  };
}
