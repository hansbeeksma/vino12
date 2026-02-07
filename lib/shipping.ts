const SHIPPING_RATE = 7.95
const FREE_SHIPPING_THRESHOLD = 150

export function calculateShipping(subtotal: number): {
  cost: number
  isFree: boolean
  freeShippingDelta: number
} {
  const isFree = subtotal >= FREE_SHIPPING_THRESHOLD
  return {
    cost: isFree ? 0 : SHIPPING_RATE,
    isFree,
    freeShippingDelta: isFree ? 0 : FREE_SHIPPING_THRESHOLD - subtotal,
  }
}

export function formatShippingCost(cost: number): string {
  return cost === 0 ? 'Gratis' : `\u20AC${cost.toFixed(2).replace('.', ',')}`
}

export { SHIPPING_RATE, FREE_SHIPPING_THRESHOLD }
