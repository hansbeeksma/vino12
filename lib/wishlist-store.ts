import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistState {
  ids: number[]
  toggle: (id: number) => void
  has: (id: number) => boolean
  clear: () => void
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],

      toggle: (id: number) =>
        set((state) => {
          const exists = state.ids.includes(id)
          return {
            ids: exists ? state.ids.filter((i) => i !== id) : [...state.ids, id],
          }
        }),

      has: (id: number) => get().ids.includes(id),

      clear: () => set({ ids: [] }),
    }),
    { name: 'vino12-wishlist' },
  ),
)
