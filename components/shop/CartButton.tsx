'use client'

import { useCart } from '@/lib/cart-store'

export function CartButton() {
  const { quantity, toggleCart } = useCart()

  return (
    <button
      onClick={toggleCart}
      className="relative font-accent text-xs font-bold uppercase tracking-widest bg-wine text-champagne px-4 py-2 border-2 border-ink brutal-shadow brutal-hover"
      aria-label={`Winkelwagen (${quantity} items)`}
    >
      Bestel
      {quantity > 0 && (
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-ink text-offwhite text-[10px] font-bold flex items-center justify-center border border-ink">
          {quantity}
        </span>
      )}
    </button>
  )
}
