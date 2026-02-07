"use client";

import { useEffect } from "react";
import { useRecentlyViewedStore } from "@/features/recently-viewed/store";

export function TrackView({ slug }: { slug: string }) {
  const addViewed = useRecentlyViewedStore((s) => s.addViewed);

  useEffect(() => {
    addViewed(slug);
  }, [slug, addViewed]);

  return null;
}
