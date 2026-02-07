import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],

      toggle: (id: string) =>
        set((state) => {
          const exists = state.ids.includes(id);
          return {
            ids: exists
              ? state.ids.filter((i) => i !== id)
              : [...state.ids, id],
          };
        }),

      has: (id: string) => get().ids.includes(id),

      clear: () => set({ ids: [] }),
    }),
    { name: "vino12-wishlist" },
  ),
);
