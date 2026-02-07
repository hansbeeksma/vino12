import type { Wine } from './types'

export interface SearchResult {
  wine: Wine
  score: number
  matchedFields: string[]
}

export function searchWines(wines: Wine[], query: string): SearchResult[] {
  if (!query || query.length < 2) return []

  const terms = query.toLowerCase().split(/\s+/)

  return wines
    .map((wine) => {
      let score = 0
      const matchedFields: string[] = []

      const fields: [string, string, number][] = [
        ['naam', wine.name.toLowerCase(), 3],
        ['druif', wine.grape.toLowerCase(), 2],
        ['regio', wine.region.toLowerCase(), 2],
        ['land', wine.country.toLowerCase(), 1],
        ['beschrijving', wine.description.toLowerCase(), 1],
        ['kleur', wine.color === 'red' ? 'rood rode' : 'wit witte', 1],
      ]

      for (const term of terms) {
        for (const [label, value, weight] of fields) {
          if (value.includes(term)) {
            score += weight
            if (!matchedFields.includes(label)) {
              matchedFields.push(label)
            }
          }
        }
      }

      return { wine, score, matchedFields }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
}
