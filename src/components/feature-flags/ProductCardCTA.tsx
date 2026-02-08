"use client";

import { useFeature } from "@growthbook/growthbook-react";
import { Button } from "@/components/ui/button";

/**
 * Example A/B test component: Product Card CTA
 *
 * Experiment: "product-card-cta"
 * - Control: "Bekijk"
 * - Variant A: "Ontdek"
 * - Variant B: "Proef"
 *
 * Hypothesis: Different CTAs impact click-through rate
 * Success metric: MAWCM (Monthly Active Wine Club Members)
 *
 * Setup in GrowthBook dashboard:
 * 1. Create experiment: "product-card-cta"
 * 2. Variations:
 *    - control (33%): { text: "Bekijk" }
 *    - variant-a (33%): { text: "Ontdek" }
 *    - variant-b (34%): { text: "Proef" }
 * 3. Link to MAWCM metric
 * 4. Set traffic allocation: 100%
 */
export function ProductCardCTA({ productId }: { productId: string }) {
  const experiment = useFeature<{ text: string }>("product-card-cta");

  // Get CTA text from experiment (fallback to default)
  const ctaText = experiment.value?.text || "Bekijk";

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => {
        // Track click for analytics
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "product_card_click", {
            product_id: productId,
            cta_variant: experiment.value?.text || "control",
          });
        }
      }}
    >
      {ctaText}
    </Button>
  );
}
