"use client";

import { useCartStore } from "@/features/cart/store";
import { useCartUI } from "@/features/cart/ui-store";
import { formatPriceShort } from "@/lib/utils";
import Link from "next/link";

export function CartDrawer() {
  const {
    items,
    subtotal_cents,
    shipping_cents,
    total_cents,
    item_count,
    removeItem,
    updateQuantity,
  } = useCartStore();
  const { isOpen, close } = useCartUI();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-ink/50 z-50" onClick={close} />

      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-offwhite border-l-brutal border-ink z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-ink">
          <h2 className="font-display text-2xl font-bold">
            Winkelwagen{" "}
            {item_count > 0 && (
              <span className="text-wine">({item_count})</span>
            )}
          </h2>
          <button
            onClick={close}
            className="font-accent text-xs uppercase tracking-widest text-ink hover:text-wine"
          >
            Sluiten ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-display text-xl text-ink/50 mb-4">
                Je winkelwagen is leeg
              </p>
              <Link
                href="/wijnen"
                onClick={close}
                className="font-accent text-xs font-bold uppercase tracking-wider bg-wine text-champagne px-6 py-3 border-2 border-ink brutal-shadow brutal-hover inline-block"
              >
                Bekijk wijnen
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.wine_id}
                  className="border-brutal border-ink bg-offwhite p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display text-lg font-bold">
                        {item.name}
                      </h3>
                      <p className="font-accent text-[10px] uppercase tracking-widest text-ink/50">
                        {item.vintage && `${item.vintage} · `}
                        {item.volume_ml}ml
                      </p>
                    </div>
                    <span className="font-display text-lg font-bold text-wine">
                      {formatPriceShort(item.price_cents * item.quantity)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.wine_id, item.quantity - 1)
                        }
                        className="w-8 h-8 border-2 border-ink font-display font-bold text-lg flex items-center justify-center hover:bg-ink hover:text-offwhite"
                      >
                        −
                      </button>
                      <span className="font-display text-xl font-bold w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.wine_id, item.quantity + 1)
                        }
                        className="w-8 h-8 border-2 border-ink font-display font-bold text-lg flex items-center justify-center hover:bg-ink hover:text-offwhite"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.wine_id)}
                      className="font-accent text-[10px] uppercase tracking-widest text-ink/40 hover:text-wine"
                    >
                      Verwijder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t-2 border-ink space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-accent text-xs uppercase tracking-widest text-ink/60">
                  Subtotaal
                </span>
                <span className="font-display text-lg font-bold">
                  {formatPriceShort(subtotal_cents)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-accent text-xs uppercase tracking-widest text-ink/60">
                  Verzending
                </span>
                <span className="font-display text-lg font-bold">
                  {shipping_cents === 0
                    ? "Gratis"
                    : formatPriceShort(shipping_cents)}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between border-t-2 border-ink pt-3">
              <span className="font-accent text-xs uppercase tracking-widest">
                Totaal
              </span>
              <span className="font-display text-3xl font-bold text-wine">
                {formatPriceShort(total_cents)}
              </span>
            </div>
            <Link
              href="/afrekenen"
              onClick={close}
              className="block w-full text-center font-accent text-base font-bold uppercase tracking-wider bg-wine text-champagne px-8 py-4 border-brutal border-ink brutal-shadow brutal-hover"
            >
              Afrekenen →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
