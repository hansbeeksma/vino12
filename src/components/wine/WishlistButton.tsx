"use client";

import { useWishlistStore } from "@/features/wishlist/store";

interface WishlistButtonProps {
  wineId: string;
  className?: string;
}

export function WishlistButton({
  wineId,
  className = "",
}: WishlistButtonProps) {
  const { toggle, has } = useWishlistStore();
  const saved = has(wineId);

  return (
    <button
      onClick={() => toggle(wineId)}
      className={`font-accent text-xs uppercase tracking-widest border-2 border-ink px-4 py-2 transition-colors ${
        saved ? "bg-wine text-champagne" : "bg-offwhite text-ink hover:bg-ink/5"
      } ${className}`}
      aria-label={
        saved ? "Verwijder uit favorieten" : "Voeg toe aan favorieten"
      }
    >
      {saved ? "\u2665 Opgeslagen" : "\u2661 Bewaren"}
    </button>
  );
}
