'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { CartButton } from '@/components/shop/CartButton'
import { SearchDialog } from '@/components/search/SearchDialog'

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false)

  const openSearch = useCallback(() => setSearchOpen(true), [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-offwhite border-b-brutal border-ink">
        <div className="container-brutal flex items-center justify-between px-4 py-3 md:px-8">
          <Link
            href="/"
            className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-ink"
          >
            VINO<span className="text-wine">12</span>
          </Link>
          <nav className="flex items-center gap-4 md:gap-6">
            <Link
              href="/wijnen"
              className="font-accent text-xs uppercase tracking-widest text-ink hover:text-wine"
            >
              Wijnen
            </Link>
            <Link
              href="/blog"
              className="font-accent text-xs uppercase tracking-widest text-ink hover:text-wine hidden md:block"
            >
              Blog
            </Link>
            <button
              onClick={openSearch}
              className="font-accent text-xs uppercase tracking-widest text-ink hover:text-wine"
              aria-label="Zoeken"
            >
              Zoek
            </button>
            <CartButton />
          </nav>
        </div>
      </header>
      <SearchDialog isOpen={searchOpen} onClose={closeSearch} />
    </>
  )
}
