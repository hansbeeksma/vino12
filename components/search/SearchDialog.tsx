'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { wines } from '@/lib/wines'
import { searchWines } from '@/lib/search'
import type { SearchResult } from '@/lib/search'

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = useCallback((value: string) => {
    setQuery(value)
    setResults(searchWines(wines, value))
  }, [])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/60" onClick={onClose} />

      {/* Dialog */}
      <div className="relative w-full max-w-xl mx-4 border-brutal border-ink bg-offwhite brutal-shadow">
        {/* Search input */}
        <div className="flex items-center border-b-2 border-ink">
          <span className="pl-4 font-accent text-xs text-ink/40">ZOEK</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Zoek op naam, druif, regio..."
            className="flex-1 px-4 py-4 font-body text-lg bg-transparent focus:outline-none"
          />
          <button
            onClick={onClose}
            className="px-4 py-4 font-accent text-xs uppercase tracking-widest text-ink/40 hover:text-wine"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        {query.length >= 2 && (
          <div className="max-h-[50vh] overflow-y-auto">
            {results.length === 0 ? (
              <div className="p-6 text-center">
                <p className="font-body text-lg text-ink/40">
                  Geen wijnen gevonden voor &ldquo;{query}&rdquo;
                </p>
              </div>
            ) : (
              <div>
                <p className="px-4 pt-3 font-accent text-[10px] uppercase tracking-widest text-ink/40">
                  {results.length} {results.length === 1 ? 'resultaat' : 'resultaten'}
                </p>
                {results.map(({ wine, matchedFields }) => (
                  <Link
                    key={wine.id}
                    href={`/wijn/${wine.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-champagne/30 transition-colors"
                  >
                    <div
                      className={`w-3 h-3 border border-ink ${wine.color === 'red' ? 'bg-wine' : 'bg-champagne'}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-base font-bold text-ink truncate">
                        {wine.name}
                      </p>
                      <p className="font-accent text-[10px] uppercase tracking-widest text-ink/40">
                        {wine.grape} &middot; {wine.region} &middot; {matchedFields.join(', ')}
                      </p>
                    </div>
                    <span className="font-display text-base font-bold text-wine">
                      &euro;{wine.price}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {query.length < 2 && (
          <div className="p-6 text-center">
            <p className="font-accent text-xs uppercase tracking-widest text-ink/30">
              Typ minstens 2 letters om te zoeken
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
