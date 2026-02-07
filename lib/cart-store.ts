import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const BOX_PRICE = 175

interface CartState {
  quantity: number
  total: number
  isOpen: boolean
  addBox: () => void
  removeBox: () => void
  setQuantity: (qty: number) => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      quantity: 0,
      total: 0,
      isOpen: false,

      addBox: () =>
        set((state) => {
          const quantity = state.quantity + 1
          return { quantity, total: quantity * BOX_PRICE, isOpen: true }
        }),

      removeBox: () =>
        set((state) => {
          const quantity = Math.max(0, state.quantity - 1)
          return { quantity, total: quantity * BOX_PRICE }
        }),

      setQuantity: (qty: number) =>
        set(() => {
          const quantity = Math.max(0, qty)
          return { quantity, total: quantity * BOX_PRICE }
        }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'vino12-cart',
      partialize: (state) => ({ quantity: state.quantity, total: state.total }),
    },
  ),
)
