'use client'

import { useCart } from '@/lib/cart-store'

export function CtaSection() {
  const { addBox } = useCart()

  return (
    <section id="bestel" className="section-padding bg-champagne border-t-brutal border-ink">
      <div className="container-brutal text-center">
        <p className="font-accent text-xs uppercase tracking-[0.3em] text-wine mb-4">
          Klaar om te ontdekken?
        </p>
        <h2 className="font-display text-display-lg text-ink mb-4">
          BESTEL JOUW
          <br />
          <span className="text-wine">VINO12 BOX</span>
        </h2>
        <p className="font-body text-xl text-ink/70 max-w-lg mx-auto mb-4">
          12 premium wijnen. 6 rood. 6 wit. Van licht en fris tot vol en complex. Gratis verzending
          binnen Nederland.
        </p>

        <div className="inline-block border-brutal-lg border-ink bg-offwhite brutal-shadow-lg p-4 md:p-8 mb-8">
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className="font-display text-6xl md:text-7xl font-bold text-wine">€175</span>
            <span className="font-accent text-xs text-ink/50 uppercase tracking-widest">/ box</span>
          </div>
          <p className="font-accent text-xs text-ink/50 uppercase tracking-widest">
            12 flessen · €14,58 per fles · Gratis verzending
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={addBox}
            className="font-accent font-bold uppercase tracking-wider border-brutal border-ink brutal-shadow brutal-hover inline-block text-center cursor-pointer bg-wine text-champagne hover:bg-burgundy px-8 py-4 text-base"
          >
            Bestel Nu →
          </button>
          <p className="font-accent text-[10px] text-ink/40 uppercase tracking-widest">
            Levering binnen 3-5 werkdagen · 21+ verificatie bij levering
          </p>
        </div>
      </div>
    </section>
  )
}
