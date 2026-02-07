"use client";

import { useCart } from "@/lib/cart-context";
import { CheckoutButton } from "./CheckoutButton";

export function CartDrawer() {
  const { quantity, total, isOpen, closeCart, addBox, removeBox } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/50 z-50"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-offwhite border-l-brutal border-ink z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-ink">
          <h2 className="font-display text-2xl font-bold">Winkelwagen</h2>
          <button
            onClick={closeCart}
            className="font-accent text-xs uppercase tracking-widest text-ink hover:text-wine"
          >
            Sluiten ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {quantity === 0 ? (
            <div className="text-center py-12">
              <p className="font-display text-xl text-ink/50 mb-4">
                Je winkelwagen is leeg
              </p>
              <button
                onClick={() => {
                  addBox();
                }}
                className="font-accent text-xs font-bold uppercase tracking-wider bg-wine text-champagne px-6 py-3 border-2 border-ink brutal-shadow brutal-hover"
              >
                Voeg Vino12 Box Toe
              </button>
            </div>
          ) : (
            <div className="border-brutal border-ink bg-offwhite p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display text-lg font-bold">Vino12 Box</h3>
                  <p className="font-accent text-[10px] uppercase tracking-widest text-ink/50">
                    12 flessen · 6 rood · 6 wit
                  </p>
                </div>
                <span className="font-display text-xl font-bold text-wine">
                  €175
                </span>
              </div>

              {/* Quantity control */}
              <div className="flex items-center gap-3">
                <button
                  onClick={removeBox}
                  className="w-8 h-8 border-2 border-ink font-display font-bold text-lg flex items-center justify-center hover:bg-ink hover:text-offwhite"
                >
                  −
                </button>
                <span className="font-display text-xl font-bold w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={addBox}
                  className="w-8 h-8 border-2 border-ink font-display font-bold text-lg flex items-center justify-center hover:bg-ink hover:text-offwhite"
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {quantity > 0 && (
          <div className="p-6 border-t-2 border-ink space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-accent text-xs uppercase tracking-widest">
                Totaal
              </span>
              <span className="font-display text-3xl font-bold text-wine">
                €{total}
              </span>
            </div>
            <p className="font-accent text-[10px] text-ink/40 uppercase tracking-widest">
              Gratis verzending · Levering 3-5 werkdagen
            </p>
            <CheckoutButton />
          </div>
        )}
      </div>
    </>
  );
}
