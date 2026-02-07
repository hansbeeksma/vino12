import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Cart, CartItem } from "./types";

interface CartStore extends Cart {
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (wineId: string) => void;
  updateQuantity: (wineId: string, quantity: number) => void;
  clearCart: () => void;
}

function calculateTotals(items: CartItem[]) {
  const subtotal_cents = items.reduce(
    (sum, item) => sum + item.price_cents * item.quantity,
    0,
  );
  const FREE_SHIPPING_THRESHOLD = 7500; // 75 EUR
  const SHIPPING_COST = 695; // 6.95 EUR
  const shipping_cents =
    subtotal_cents >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const item_count = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    subtotal_cents,
    shipping_cents,
    total_cents: subtotal_cents + shipping_cents,
    item_count,
  };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      subtotal_cents: 0,
      shipping_cents: 0,
      total_cents: 0,
      item_count: 0,

      addItem: (newItem) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.wine_id === newItem.wine_id,
          );

          let updatedItems: CartItem[];
          if (existingIndex >= 0) {
            updatedItems = state.items.map((item, index) =>
              index === existingIndex
                ? {
                    ...item,
                    quantity: Math.min(item.quantity + 1, item.max_quantity),
                  }
                : item,
            );
          } else {
            updatedItems = [...state.items, { ...newItem, quantity: 1 }];
          }

          return { items: updatedItems, ...calculateTotals(updatedItems) };
        }),

      removeItem: (wineId) =>
        set((state) => {
          const updatedItems = state.items.filter(
            (item) => item.wine_id !== wineId,
          );
          return { items: updatedItems, ...calculateTotals(updatedItems) };
        }),

      updateQuantity: (wineId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            const updatedItems = state.items.filter(
              (item) => item.wine_id !== wineId,
            );
            return { items: updatedItems, ...calculateTotals(updatedItems) };
          }

          const updatedItems = state.items.map((item) =>
            item.wine_id === wineId
              ? { ...item, quantity: Math.min(quantity, item.max_quantity) }
              : item,
          );
          return { items: updatedItems, ...calculateTotals(updatedItems) };
        }),

      clearCart: () =>
        set({
          items: [],
          subtotal_cents: 0,
          shipping_cents: 0,
          total_cents: 0,
          item_count: 0,
        }),
    }),
    {
      name: "vino12-cart",
    },
  ),
);
