"use client";

import { useCartStore } from "@/features/cart/store";
import { useCartUI } from "@/features/cart/ui-store";

export function CartButton() {
  const itemCount = useCartStore((s) => s.item_count);
  const toggle = useCartUI((s) => s.toggle);

  return (
    <button
      onClick={toggle}
      className="relative font-accent text-xs font-bold uppercase tracking-widest bg-wine text-champagne px-4 py-2 border-2 border-ink brutal-shadow brutal-hover"
      aria-label={`Winkelwagen (${itemCount} items)`}
    >
      Bestel
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-ink text-offwhite text-[10px] font-bold flex items-center justify-center border border-ink">
          {itemCount}
        </span>
      )}
    </button>
  );
}
