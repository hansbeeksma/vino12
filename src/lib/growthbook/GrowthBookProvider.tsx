"use client";

import { useEffect } from "react";
import {
  GrowthBook,
  GrowthBookProvider as GBProvider,
} from "@growthbook/growthbook-react";

// Initialize GrowthBook client-side
const gb = new GrowthBook({
  apiHost:
    process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST || "http://localhost:3101",
  clientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY || "",
  enableDevMode: process.env.NODE_ENV === "development",
  trackingCallback: (experiment, result) => {
    // Track experiment views in analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "experiment_viewed", {
        experiment_id: experiment.key,
        variation_id: result.key,
      });
    }
  },
});

export function GrowthBookProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Load features from GrowthBook API
    gb.loadFeatures();

    // Set user attributes (anonymous by default)
    gb.setAttributes({
      id: "anonymous",
      deviceType: window.innerWidth < 768 ? "mobile" : "desktop",
      url: window.location.href,
    });
  }, []);

  return <GBProvider growthbook={gb}>{children}</GBProvider>;
}

export { gb };
