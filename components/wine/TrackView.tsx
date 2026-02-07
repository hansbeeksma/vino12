'use client'

import { useEffect } from 'react'
import { useRecentlyViewed } from '@/lib/recently-viewed-store'

export function TrackView({ slug }: { slug: string }) {
  const addViewed = useRecentlyViewed((s) => s.addViewed)

  useEffect(() => {
    addViewed(slug)
  }, [slug, addViewed])

  return null
}
