'use client'

import { useRecentlyViewed } from '@/lib/recently-viewed-store'
import { getWineBySlug } from '@/lib/wines'
import { WineCard } from './WineCard'

interface RecentlyViewedProps {
  excludeSlug?: string
}

export function RecentlyViewed({ excludeSlug }: RecentlyViewedProps) {
  const { slugs } = useRecentlyViewed()

  const wines = slugs
    .filter((s) => s !== excludeSlug)
    .map(getWineBySlug)
    .filter(Boolean)
    .slice(0, 4)

  if (wines.length === 0) return null

  return (
    <section className="container-brutal px-4 py-12 md:px-8">
      <h2 className="font-display text-2xl font-bold text-ink mb-6">Recent Bekeken</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {wines.map((wine) => (
          <WineCard key={wine!.id} wine={wine!} />
        ))}
      </div>
    </section>
  )
}
