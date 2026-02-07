'use client'

import { useState } from 'react'
import { wines } from '@/lib/wines'
import type { WineColor, BodyLevel } from '@/lib/types'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WineCard } from '@/components/wine/WineCard'
import { MarqueeStrip } from '@/components/ui/MarqueeStrip'

type FilterColor = 'all' | WineColor
type SortOption = 'default' | 'price-asc' | 'price-desc' | 'body-asc' | 'body-desc'

const bodyOrder: Record<BodyLevel, number> = {
  Light: 1,
  'Light-Medium': 2,
  Medium: 3,
  'Medium-Full': 4,
  Full: 5,
}

export default function WinesPage() {
  const [colorFilter, setColorFilter] = useState<FilterColor>('all')
  const [sort, setSort] = useState<SortOption>('default')

  const filtered = wines.filter((w) => {
    if (colorFilter !== 'all' && w.color !== colorFilter) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'price-asc':
        return a.price - b.price
      case 'price-desc':
        return b.price - a.price
      case 'body-asc':
        return bodyOrder[a.body] - bodyOrder[b.body]
      case 'body-desc':
        return bodyOrder[b.body] - bodyOrder[a.body]
      default:
        return 0
    }
  })

  const redCount = wines.filter((w) => w.color === 'red').length
  const whiteCount = wines.filter((w) => w.color === 'white').length

  return (
    <>
      <Header />
      <main className="min-h-screen bg-offwhite pt-20">
        <div className="container-brutal px-4 py-8 md:px-8 md:py-12">
          {/* Header */}
          <div className="mb-8">
            <p className="font-accent text-xs uppercase tracking-[0.3em] text-wine mb-2">
              De Collectie
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-ink mb-4">
              Alle Wijnen
            </h1>
            <p className="font-body text-xl text-ink/60 max-w-2xl">
              {wines.length} premium wijnen, zorgvuldig gecureerd. {redCount} rood, {whiteCount}{' '}
              wit. Van licht en fris tot vol en complex.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-8 border-b-2 border-ink/10 pb-6">
            <div className="flex gap-2">
              <FilterButton active={colorFilter === 'all'} onClick={() => setColorFilter('all')}>
                Alle ({wines.length})
              </FilterButton>
              <FilterButton active={colorFilter === 'red'} onClick={() => setColorFilter('red')}>
                Rood ({redCount})
              </FilterButton>
              <FilterButton
                active={colorFilter === 'white'}
                onClick={() => setColorFilter('white')}
              >
                Wit ({whiteCount})
              </FilterButton>
            </div>

            <div className="ml-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="font-accent text-xs uppercase tracking-widest bg-offwhite border-2 border-ink px-3 py-2 cursor-pointer"
              >
                <option value="default">Volgorde</option>
                <option value="price-asc">Prijs laag-hoog</option>
                <option value="price-desc">Prijs hoog-laag</option>
                <option value="body-asc">Body licht-vol</option>
                <option value="body-desc">Body vol-licht</option>
              </select>
            </div>
          </div>

          {/* Wine Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {sorted.map((wine) => (
              <WineCard key={wine.id} wine={wine} />
            ))}
          </div>

          {sorted.length === 0 && (
            <div className="text-center py-12">
              <p className="font-display text-2xl text-ink/50">Geen wijnen gevonden</p>
            </div>
          )}
        </div>

        <MarqueeStrip text="VINO12 ★ 12 PREMIUM WIJNEN ★ 6 ROOD ★ 6 WIT ★ PERFECTE BALANS" />
      </main>
      <Footer />
    </>
  )
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`font-accent text-xs uppercase tracking-widest px-4 py-2 border-2 border-ink transition-colors ${
        active ? 'bg-ink text-offwhite' : 'bg-offwhite text-ink hover:bg-ink/5'
      }`}
    >
      {children}
    </button>
  )
}
