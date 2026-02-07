"use client";

import { useEffect, useMemo, useState } from "react";
import { useRecentlyViewedStore } from "@/features/recently-viewed/store";
import { createClient } from "@/lib/supabase/client";
import { WineCard } from "./WineCard";
import type { WineRow } from "@/lib/api/wines";

interface RecentlyViewedProps {
  excludeSlug?: string;
}

export function RecentlyViewed({ excludeSlug }: RecentlyViewedProps) {
  const { slugs } = useRecentlyViewedStore();
  const [wines, setWines] = useState<WineRow[]>([]);

  const filteredSlugs = useMemo(
    () => slugs.filter((s) => s !== excludeSlug).slice(0, 4),
    [slugs, excludeSlug],
  );

  useEffect(() => {
    if (filteredSlugs.length === 0) return;

    const supabase = createClient();
    supabase
      .from("wines")
      .select("*, region:regions(id, name, country)")
      .in("slug", filteredSlugs)
      .eq("is_active", true)
      .then(({ data }) => {
        if (!data) return;
        const sorted = filteredSlugs
          .map((slug) => (data as WineRow[]).find((w) => w.slug === slug))
          .filter(Boolean) as WineRow[];
        setWines(sorted);
      });
  }, [filteredSlugs]);

  if (wines.length === 0) return null;

  return (
    <section className="container-brutal px-4 py-12 md:px-8">
      <h2 className="font-display text-2xl font-bold text-ink mb-6">
        Recent Bekeken
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {wines.map((wine) => (
          <WineCard key={wine.id} wine={wine} />
        ))}
      </div>
    </section>
  );
}
