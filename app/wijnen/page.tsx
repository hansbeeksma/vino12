'use client'

import { useState, useMemo } from 'react'
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

const allRegions = Array.from(new Set(wines.map((w) => w.region))).sort()
const allGrapes = Array.from(new Set(wines.map((w) => w.grape))).sort()
const allBodies: BodyLevel[] = ['Light', 'Light-Medium', 'Medium', 'Medium-Full', 'Full']

export default function WinesPage() {
  const [colorFilter, setColorFilter] = useState<FilterColor>('all')
  const [regionFilter, setRegionFilter] = useState<string>('all')
  const [grapeFilter, setGrapeFilter] = useState<string>('all')
  const [bodyFilter, setBodyFilter] = useState<string>('all')
  const [sort, setSort] = useState<SortOption>('default')

  const activeFilterCount = [colorFilter, regionFilter, grapeFilter, bodyFilter].filter(
    (f) => f !== 'all',
  ).length

  const filtered = useMemo(
    () =>
      wines.filter((w) => {
        if (colorFilter !== 'all' && w.color !== colorFilter) return false
        if (regionFilter !== 'all' && w.region !== regionFilter) return false
        if (grapeFilter !== 'all' && w.grape !== grapeFilter) return false
        if (bodyFilter !== 'all' && w.body !== bodyFilter) return false
        return true
      }),
    [colorFilter, regionFilter, grapeFilter, bodyFilter],
  )

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) => {
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
      }),
    [filtered, sort],
  )

  const redCount = wines.filter((w) => w.color === 'red').length
  const whiteCount = wines.filter((w) => w.color === 'white').length

  function clearFilters() {
    setColorFilter('all')
    setRegionFilter('all')
    setGrapeFilter('all')
    setBodyFilter('all')
    setSort('default')
  }

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

          {/* Color Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
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
          </div>

          {/* Faceted Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-8 border-b-2 border-ink/10 pb-6">
            <FilterSelect
              value={regionFilter}
              onChange={setRegionFilter}
              label="Regio"
              options={allRegions}
            />
            <FilterSelect
              value={grapeFilter}
              onChange={setGrapeFilter}
              label="Druif"
              options={allGrapes}
            />
            <FilterSelect
              value={bodyFilter}
              onChange={setBodyFilter}
              label="Body"
              options={allBodies}
            />

            <div className="ml-auto flex items-center gap-3">
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="font-accent text-xs uppercase tracking-widest text-ink/40 hover:text-wine"
                >
                  Wis filters ({activeFilterCount})
                </button>
              )}
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

          {/* Results count */}
          <p className="font-accent text-xs uppercase tracking-widest text-ink/40 mb-4">
            {sorted.length} {sorted.length === 1 ? 'wijn' : 'wijnen'}
          </p>

          {/* Wine Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {sorted.map((wine) => (
              <WineCard key={wine.id} wine={wine} />
            ))}
          </div>

          {sorted.length === 0 && (
            <div className="text-center py-12">
              <p className="font-display text-2xl text-ink/50 mb-4">Geen wijnen gevonden</p>
              <button
                onClick={clearFilters}
                className="font-accent text-xs uppercase tracking-widest text-wine hover:text-ink"
              >
                Wis alle filters
              </button>
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

function FilterSelect({
  value,
  onChange,
  label,
  options,
}: {
  value: string
  onChange: (value: string) => void
  label: string
  options: string[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`font-accent text-xs uppercase tracking-widest border-2 px-3 py-2 cursor-pointer ${
        value !== 'all' ? 'border-wine bg-wine/5 text-wine' : 'border-ink bg-offwhite text-ink'
      }`}
    >
      <option value="all">{label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  )
}
