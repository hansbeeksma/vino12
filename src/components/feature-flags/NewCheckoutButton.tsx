"use client";

import { useFeature } from "@growthbook/growthbook-react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart } from "lucide-react";

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
    // New checkout experience (feature ON)
    return (
      <Button
        size="lg"
        className="w-full bg-wine-600 hover:bg-wine-700 text-white"
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        Veilig Afrekenen
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    );
  }

  // Default checkout button (feature OFF)
  return (
    <Button size="lg" className="w-full">
      Naar Afrekenen
    </Button>
  );
}
