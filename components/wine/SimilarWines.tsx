import Link from 'next/link'
import type { Wine } from '@/lib/types'
import { WineCard } from './WineCard'

interface SimilarWinesProps {
  currentWine: Wine
  allWines: Wine[]
}

export function SimilarWines({ currentWine, allWines }: SimilarWinesProps) {
  // Find similar wines: same color first, then same body level, exclude current
  const similar = allWines
    .filter((w) => w.id !== currentWine.id)
    .map((w) => {
      let score = 0
      if (w.color === currentWine.color) score += 3
      if (w.body === currentWine.body) score += 2
      if (w.region === currentWine.region) score += 1
      if (w.grape === currentWine.grape) score += 1
      return { wine: w, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.wine)

  if (similar.length === 0) return null

  return (
    <section className="container-brutal px-4 py-12 md:px-8">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-ink">Vergelijkbare Wijnen</h2>
        <Link
          href="/wijnen"
          className="font-accent text-xs uppercase tracking-widest text-ink/50 hover:text-wine"
        >
          Alle wijnen &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {similar.map((wine) => (
          <WineCard key={wine.id} wine={wine} />
        ))}
      </div>
    </section>
  )
}
