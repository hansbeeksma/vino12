"use client";

import { useFeatureIsOn, useFeature } from "@growthbook/growthbook-react";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { trackHomepageCTAClick } from "@/lib/analytics/plausible";

/**
 * A/B Experiment: Homepage CTA Text
 *
 * GrowthBook experiment key: "homepage-cta-text"
 * - Control: "Ontdek de box →" (current)
 * - Variant A: "Ontdek onze wijnen →"
 * - Variant B: "Proef 12 curated wijnen →"
 *
 * Metric: Click-through rate to /wijnen
 *
 * Setup in GrowthBook dashboard:
 * 1. Create feature: "homepage-cta-text" (string)
 * 2. Add experiment rule with variations:
 *    - control: "Ontdek de box →"
 *    - variant-a: "Ontdek onze wijnen →"
 *    - variant-b: "Proef 12 curated wijnen →"
 * 3. Set tracking key: "homepage-cta-experiment"
 * 4. Traffic allocation: 100%
 */
export function HomepageCTA() {
  const ctaFeature = useFeature<string>("homepage-cta-text");
  const isExperimentActive = useFeatureIsOn("homepage-cta-text");

  const ctaText =
    isExperimentActive && ctaFeature.value
      ? ctaFeature.value
      : "Ontdek de box →";

  return (
    <BrutalButton
      variant="primary"
      size="lg"
      href="/wijnen"
      onClick={() => trackHomepageCTAClick(ctaFeature.value || "control")}
    >
      {ctaText}
    </BrutalButton>
  );
}
