"use client";

import { useEffect, useState } from "react";
import type { SocialProofData } from "@/lib/gamification/types";
import { isFeatureEnabled } from "@/lib/feature-flags";

interface SocialProofIndicatorProps {
  wineId: string;
}

export function SocialProofIndicator({ wineId }: SocialProofIndicatorProps) {
  const [data, setData] = useState<SocialProofData | null>(null);
  const enabled = isFeatureEnabled("social.proof");

  useEffect(() => {
    if (!enabled) return;

    async function load() {
      try {
        // Track view
        fetch("/api/gamification/social-proof", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            wine_id: wineId,
            activity_type: "view",
          }),
        });

        // Load social proof data
        const res = await fetch(
          `/api/gamification/social-proof?wine_id=${wineId}`,
        );
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch {
        // Social proof is non-critical, silently fail
      }
    }

    load();
  }, [wineId, enabled]);

  if (!data) return null;

  const indicators: { text: string; show: boolean }[] = [
    {
      text: `${data.recent_viewers} ${data.recent_viewers === 1 ? "persoon bekijkt" : "mensen bekijken"} deze wijn`,
      show: data.recent_viewers > 0,
    },
    {
      text: `${data.recent_purchases}x gekocht vandaag`,
      show: data.recent_purchases > 0,
    },
  ];

  const visible = indicators.filter((i) => i.show);
  if (visible.length === 0) return null;

  return (
    <div className="space-y-1">
      {visible.map((indicator) => (
        <p
          key={indicator.text}
          className="font-body text-xs text-wine/80 flex items-center gap-1"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-wine animate-pulse" />
          {indicator.text}
        </p>
      ))}
    </div>
  );
}
