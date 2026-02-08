"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  hasSpeechRecognition,
  hasCameraAccess,
  hasWebGL,
} from "@/lib/browser-support";

type Feature = "camera" | "speech" | "webgl";

interface FeatureGateProps {
  feature: Feature;
  fallback: ReactNode;
  children: ReactNode;
}

async function checkFeature(feature: Feature): Promise<boolean> {
  switch (feature) {
    case "camera":
      return hasCameraAccess();
    case "speech":
      return hasSpeechRecognition();
    case "webgl":
      return hasWebGL();
  }
}

export function FeatureGate({ feature, fallback, children }: FeatureGateProps) {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    checkFeature(feature).then(setSupported);
  }, [feature]);

  if (supported === null) return null;
  if (!supported) return <>{fallback}</>;
  return <>{children}</>;
}
