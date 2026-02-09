"use client";

import { useFeature } from "@growthbook/growthbook-react";
import { BrutalButton } from "@/components/ui/BrutalButton";

/**
 * Example feature flag component: New Checkout Flow
 *
 * Feature flag: "new-checkout-flow"
 * - ON: Shows new checkout button with improved UX
 * - OFF: Shows default checkout button
 *
 * Setup in GrowthBook dashboard:
 * 1. Create feature: "new-checkout-flow" (boolean)
 * 2. Development environment: ON
 * 3. Production environment: OFF (until tested)
 */
export function NewCheckoutButton() {
  const newCheckoutFlow = useFeature("new-checkout-flow");

  if (newCheckoutFlow.on) {
    return (
      <BrutalButton variant="primary" size="lg" className="w-full">
        Veilig Afrekenen
      </BrutalButton>
    );
  }

  return (
    <BrutalButton variant="outline-solid" size="lg" className="w-full">
      Naar Afrekenen
    </BrutalButton>
  );
}
