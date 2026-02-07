import Link from 'next/link'
import { calculateShipping, formatShippingCost } from '@/lib/shipping'

interface OrderSummaryProps {
  quantity: number
  total: number
  variant?: 'cart' | 'checkout'
  loading?: boolean
}

export function OrderSummary({ quantity, total, variant = 'cart', loading }: OrderSummaryProps) {
  const shipping = calculateShipping(total)
  const grandTotal = total + shipping.cost

  return (
    <div className="border-brutal border-ink bg-champagne/20 p-6 sticky top-24">
      <h3 className="font-display text-xl font-bold mb-6">
        {variant === 'checkout' ? 'Bestelling' : 'Overzicht'}
      </h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between font-body text-base">
          <span className="text-ink/60">{quantity}x Vino12 Box</span>
          <span>&euro;{total}</span>
        </div>
        <div className="flex justify-between font-body text-base">
          <span className="text-ink/60">Verzendkosten</span>
          <span className={shipping.isFree ? 'text-emerald font-bold' : ''}>
            {formatShippingCost(shipping.cost)}
          </span>
        </div>
        {!shipping.isFree && (
          <p className="font-accent text-[10px] text-emerald uppercase tracking-widest">
            Nog &euro;{shipping.freeShippingDelta} voor gratis verzending
          </p>
        )}
      </div>

      <div className="border-t-2 border-ink pt-4 mb-6">
        <div className="flex justify-between items-baseline">
          <span className="font-accent text-xs uppercase tracking-widest">Totaal</span>
          <span className="font-display text-3xl font-bold text-wine">&euro;{grandTotal}</span>
        </div>
        <p className="font-accent text-[10px] text-ink/40 uppercase tracking-widest mt-1">
          Inclusief BTW
        </p>
      </div>

      {variant === 'cart' && (
        <>
          <Link
            href="/afrekenen"
            className="block w-full text-center font-accent text-base font-bold uppercase tracking-wider bg-wine text-champagne px-8 py-4 border-brutal border-ink brutal-shadow brutal-hover"
          >
            Afrekenen &rarr;
          </Link>
          <p className="font-accent text-[10px] text-ink/40 uppercase tracking-widest text-center mt-4">
            Gratis verzending &middot; Levering 3-5 werkdagen
          </p>
        </>
      )}

      {variant === 'checkout' && (
        <>
          <button
            type="submit"
            disabled={loading}
            className="w-full font-accent text-base font-bold uppercase tracking-wider bg-wine text-champagne px-8 py-4 border-brutal border-ink brutal-shadow brutal-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Laden...' : 'Bestelling plaatsen \u2192'}
          </button>
          <p className="font-accent text-[10px] text-ink/40 uppercase tracking-widest text-center mt-4">
            Je wordt doorgestuurd naar de betaalpagina
          </p>
        </>
      )}
    </div>
  )
}
