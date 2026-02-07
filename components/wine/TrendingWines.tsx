'use client'

import Link from 'next/link'
import { wines } from '@/lib/wines'
import { WineCard } from './WineCard'

export function TrendingWines() {
  // Show a curated selection: top-rated/most interesting wines
  // Pick wines with diverse colors and body levels
  const trending = [
    wines.find((w) => w.slug === 'pinot-noir-bourgogne'),
    wines.find((w) => w.slug === 'sauvignon-blanc-loire'),
    wines.find((w) => w.slug === 'syrah-northern-rhone'),
    wines.find((w) => w.slug === 'riesling-alsace'),
  ].filter(Boolean)

  if (trending.length === 0) return null

  return (
    <section className="container-brutal px-4 py-12 md:px-8">
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <p className="font-accent text-xs uppercase tracking-[0.3em] text-wine mb-1">Populair</p>
          <h2 className="font-display text-2xl font-bold text-ink">Trending Wijnen</h2>
        </div>
        <Link
          href="/wijnen"
          className="font-accent text-xs uppercase tracking-widest text-ink/50 hover:text-wine"
        >
          Alle wijnen &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {trending.map((wine) => (
          <WineCard key={wine!.id} wine={wine!} />
        ))}
      </div>
    </section>
  )
}
