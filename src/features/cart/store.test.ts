import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "./store";
import type { CartItem } from "./types";

const mockItem: Omit<CartItem, "quantity"> = {
  wine_id: "wine-1",
  name: "Test Pinot Noir",
  slug: "test-pinot-noir",
  vintage: 2022,
  price_cents: 1499,
  image_url: null,
  volume_ml: 750,
  max_quantity: 12,
};

const mockItem2: Omit<CartItem, "quantity"> = {
  wine_id: "wine-2",
  name: "Test Chardonnay",
  slug: "test-chardonnay",
  vintage: 2023,
  price_cents: 1299,
  image_url: null,
  volume_ml: 750,
  max_quantity: 6,
};

describe("cart store", () => {
  beforeEach(() => {
    useCartStore.setState({
      items: [],
      subtotal_cents: 0,
      shipping_cents: 0,
      total_cents: 0,
      item_count: 0,
    });
  });

  describe("addItem", () => {
    it("adds a new item with quantity 1", () => {
      useCartStore.getState().addItem(mockItem);
      const state = useCartStore.getState();

      expect(state.items).toHaveLength(1);
      expect(state.items[0].wine_id).toBe("wine-1");
      expect(state.items[0].quantity).toBe(1);
    });

    it("increments quantity for existing item", () => {
      useCartStore.getState().addItem(mockItem);
      useCartStore.getState().addItem(mockItem);
      const state = useCartStore.getState();

      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(2);
    });

    it("respects max_quantity", () => {
      // Add item 12 times (max_quantity = 12)
      for (let i = 0; i < 15; i++) {
        useCartStore.getState().addItem(mockItem);
      }
      const state = useCartStore.getState();

      expect(state.items[0].quantity).toBe(12);
    });

    it("adds different items independently", () => {
      useCartStore.getState().addItem(mockItem);
      useCartStore.getState().addItem(mockItem2);
      const state = useCartStore.getState();

      expect(state.items).toHaveLength(2);
      expect(state.item_count).toBe(2);
    });
  });

  describe("removeItem", () => {
    it("removes an item by wine_id", () => {
      useCartStore.getState().addItem(mockItem);
      useCartStore.getState().addItem(mockItem2);
      useCartStore.getState().removeItem("wine-1");
      const state = useCartStore.getState();

      expect(state.items).toHaveLength(1);
      expect(state.items[0].wine_id).toBe("wine-2");
    });

    it("does nothing for non-existing wine_id", () => {
      useCartStore.getState().addItem(mockItem);
      useCartStore.getState().removeItem("non-existing");
      const state = useCartStore.getState();

      expect(state.items).toHaveLength(1);
    });
  });

  describe("updateQuantity", () => {
    it("updates quantity of an item", () => {
      useCartStore.getState().addItem(mockItem);
      useCartStore.getState().updateQuantity("wine-1", 5);
      const state = useCartStore.getState();

      expect(state.items[0].quantity).toBe(5);
    });

    it("removes item when quantity is 0", () => {
      useCartStore.getState().addItem(mockItem);
      useCartStore.getState().updateQuantity("wine-1", 0);
      const state = useCartStore.getState();

      expect(state.items).toHaveLength(0);
    });

    it("removes item when quantity is negative", () => {
      useCartStore.getState().addItem(mockItem);
      useCartStore.getState().updateQuantity("wine-1", -1);
      const state = useCartStore.getState();

      expect(state.items).toHaveLength(0);
    });

    it("caps at max_quantity", () => {
      useCartStore.getState().addItem(mockItem);
      useCartStore.getState().updateQuantity("wine-1", 100);
      const state = useCartStore.getState();

      expect(state.items[0].quantity).toBe(12); // max_quantity
    });
  });

  describe("clearCart", () => {
    it("removes all items and resets totals", () => {
      useCartStore.getState().addItem(mockItem);
      useCartStore.getState().addItem(mockItem2);
      useCartStore.getState().clearCart();
      const state = useCartStore.getState();

      expect(state.items).toHaveLength(0);
      expect(state.subtotal_cents).toBe(0);
      expect(state.shipping_cents).toBe(0);
      expect(state.total_cents).toBe(0);
      expect(state.item_count).toBe(0);
    });
  });

  describe("totals calculation", () => {
    it("calculates subtotal correctly", () => {
      useCartStore.getState().addItem(mockItem); // 1499
      useCartStore.getState().addItem(mockItem2); // 1299
      const state = useCartStore.getState();

      expect(state.subtotal_cents).toBe(1499 + 1299);
    });

    it("charges shipping under €75", () => {
      useCartStore.getState().addItem(mockItem); // 14.99 EUR
      const state = useCartStore.getState();

      expect(state.shipping_cents).toBe(695);
      expect(state.total_cents).toBe(1499 + 695);
    });

    it("gives free shipping at €75+", () => {
      // Add 5x 14.99 = 74.95 → shipping
      for (let i = 0; i < 5; i++) {
        useCartStore.getState().addItem(mockItem);
      }
      expect(useCartStore.getState().subtotal_cents).toBe(7495);
      expect(useCartStore.getState().shipping_cents).toBe(695);

      // Add one more → 89.94 → free shipping
      useCartStore.getState().addItem(mockItem);
      expect(useCartStore.getState().subtotal_cents).toBe(8994);
      expect(useCartStore.getState().shipping_cents).toBe(0);
    });

    it("tracks item_count as total quantity", () => {
      useCartStore.getState().addItem(mockItem);
      useCartStore.getState().addItem(mockItem);
      useCartStore.getState().addItem(mockItem2);
      const state = useCartStore.getState();

      expect(state.item_count).toBe(3); // 2 + 1
    });
  });
});
