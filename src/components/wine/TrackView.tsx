"use client";

import { useEffect } from "react";
import { useRecentlyViewedStore } from "@/features/recently-viewed/store";
import { trackWineView } from "@/lib/analytics/plausible";

export function TrackView({ slug }: { slug: string }) {
  const addViewed = useRecentlyViewedStore((s) => s.addViewed);

  useEffect(() => {
    addViewed(slug);
    trackWineView(slug);
  }, [slug, addViewed]);

  return null;
}
