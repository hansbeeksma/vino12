"use client";

import type { WineRow } from "@/lib/api/wines";
import { useCartStore } from "@/features/cart/store";
import { useAnalytics } from "@/hooks/useAnalytics";
import { trackAddToCart } from "@/lib/analytics/plausible";

interface AddToCartButtonProps {
  wine: WineRow;
}

export function AddToCartButton({ wine }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { track } = useAnalytics();

  function handleAdd() {
    addItem({
      wine_id: wine.id,
      name: wine.name,
      slug: wine.slug,
      vintage: wine.vintage,
      price_cents: wine.price_cents,
      image_url: wine.image_url,
      volume_ml: wine.volume_ml,
      max_quantity: Math.min(wine.stock_quantity, 12),
    });
    track("added_to_cart", {
      productId: wine.id,
      productName: wine.name,
      price: wine.price_cents,
      quantity: 1,
    });
    trackAddToCart(wine.name, wine.price_cents / 100);
  }

  const inStock = wine.stock_quantity > 0;

  return (
    <button
      onClick={handleAdd}
      disabled={!inStock}
      className="w-full font-accent text-base font-bold uppercase tracking-wider bg-wine text-champagne px-8 py-4 border-brutal border-ink brutal-shadow brutal-hover disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {inStock ? "In winkelwagen →" : "Uitverkocht"}
    </button>
  );
}
