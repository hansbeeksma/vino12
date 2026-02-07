"use client";

import Link from "next/link";
import { useCartStore } from "@/features/cart/store";
import { formatPrice } from "@/lib/utils";
import { BrutalButton } from "@/components/ui/BrutalButton";

export default function WinkelwagenPage() {
  const items = useCartStore((s) => s.items);
  const subtotal_cents = useCartStore((s) => s.subtotal_cents);
  const shipping_cents = useCartStore((s) => s.shipping_cents);
  const total_cents = useCartStore((s) => s.total_cents);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  if (items.length === 0) {
    return (
      <div className="bg-offwhite min-h-screen section-padding">
        <div className="container-brutal text-center py-20">
          <h1 className="font-display text-display-md text-ink mb-4">
            WINKELWAGEN
          </h1>
          <p className="font-body text-xl text-ink/70 mb-8">
            Je winkelwagen is leeg.
          </p>
          <BrutalButton variant="primary" size="lg" href="/wijnen">
            Bekijk wijnen →
          </BrutalButton>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-offwhite min-h-screen section-padding">
      <div className="container-brutal">
        <h1 className="font-display text-display-md text-ink mb-8">
          WINKELWAGEN
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.wine_id}
                className="border-brutal border-ink bg-offwhite brutal-shadow p-4 flex items-center gap-4"
              >
                <Link
                  href={`/wijn/${item.slug}`}
                  className="font-display text-lg font-bold text-ink hover:text-wine flex-1"
                >
                  {item.name}
                  {item.vintage && (
                    <span className="font-accent text-xs text-ink/50 ml-2">
                      {item.vintage}
                    </span>
                  )}
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.wine_id, item.quantity - 1)
                    }
                    className="w-8 h-8 border-2 border-ink font-display font-bold text-lg flex items-center justify-center hover:bg-ink hover:text-offwhite"
                  >
                    -
                  </button>
                  <span className="font-display text-lg font-bold w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.wine_id, item.quantity + 1)
                    }
                    disabled={item.quantity >= item.max_quantity}
                    className="w-8 h-8 border-2 border-ink font-display font-bold text-lg flex items-center justify-center hover:bg-ink hover:text-offwhite disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                <span className="font-display text-lg font-bold text-wine w-20 text-right">
                  {formatPrice(item.price_cents * item.quantity)}
                </span>

                <button
                  onClick={() => removeItem(item.wine_id)}
                  className="font-accent text-xs uppercase tracking-widest text-ink/40 hover:text-wine"
                >
                  X
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="border-brutal-lg border-ink bg-offwhite brutal-shadow-lg p-6 space-y-4 h-fit">
            <h2 className="font-display text-xl font-bold text-ink">
              Overzicht
            </h2>

            <div className="space-y-2 font-body text-base">
              <div className="flex justify-between">
                <span className="text-ink/70">Subtotaal</span>
                <span className="font-bold">{formatPrice(subtotal_cents)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/70">Verzending</span>
                <span className="font-bold">
                  {shipping_cents === 0
                    ? "Gratis"
                    : formatPrice(shipping_cents)}
                </span>
              </div>
              {shipping_cents > 0 && (
                <p className="font-accent text-[10px] text-ink/40 uppercase tracking-widest">
                  Gratis verzending vanaf €75
                </p>
              )}
            </div>

            <div className="border-t-2 border-ink pt-4 flex justify-between items-baseline">
              <span className="font-display text-lg font-bold">Totaal</span>
              <span className="font-display text-2xl font-bold text-wine">
                {formatPrice(total_cents)}
              </span>
            </div>

            <BrutalButton
              variant="primary"
              size="lg"
              href="/afrekenen"
              className="w-full text-center"
            >
              Afrekenen →
            </BrutalButton>
          </div>
        </div>
      </div>
    </div>
  );
}
