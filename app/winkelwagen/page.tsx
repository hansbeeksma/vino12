'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-store'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { OrderSummary } from '@/components/shop/OrderSummary'

export default function CartPage() {
  const { quantity, total, addBox, removeBox, setQuantity } = useCart()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-offwhite pt-20">
        <div className="container-brutal px-4 py-8 md:px-8 md:py-12">
          {/* Breadcrumb */}
          <nav className="font-accent text-xs uppercase tracking-widest text-ink/50 mb-8">
            <Link href="/" className="hover:text-wine">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink">Winkelwagen</span>
          </nav>

          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-8">Winkelwagen</h1>

          {quantity === 0 ? (
            <div className="border-brutal border-ink bg-champagne/30 p-12 text-center">
              <p className="font-display text-2xl text-ink/50 mb-4">Je winkelwagen is leeg</p>
              <p className="font-body text-lg text-ink/40 mb-8">
                Voeg een Vino12 Box toe om te beginnen.
              </p>
              <Link
                href="/#collectie"
                className="inline-block font-accent text-xs font-bold uppercase tracking-wider bg-wine text-champagne px-8 py-4 border-2 border-ink brutal-shadow brutal-hover"
              >
                Bekijk de collectie
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="border-brutal border-ink bg-offwhite p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="font-display text-2xl font-bold">Vino12 Box</h2>
                      <p className="font-accent text-xs uppercase tracking-widest text-ink/50 mt-1">
                        12 premium flessen · 6 rood · 6 wit
                      </p>
                      <p className="font-body text-base text-ink/60 mt-2">
                        Van licht en fris tot vol en complex. Zorgvuldig gecureerd.
                      </p>
                    </div>
                    <span className="font-display text-2xl font-bold text-wine">€175</span>
                  </div>

                  <div className="flex items-center justify-between border-t-2 border-ink/10 pt-4">
                    <div className="flex items-center gap-4">
                      <span className="font-accent text-xs uppercase tracking-widest text-ink/50">
                        Aantal
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={removeBox}
                          className="w-10 h-10 border-2 border-ink font-display font-bold text-lg flex items-center justify-center hover:bg-ink hover:text-offwhite"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                          className="w-16 h-10 border-2 border-ink text-center font-display text-xl font-bold bg-offwhite"
                        />
                        <button
                          onClick={addBox}
                          className="w-10 h-10 border-2 border-ink font-display font-bold text-lg flex items-center justify-center hover:bg-ink hover:text-offwhite"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => setQuantity(0)}
                      className="font-accent text-xs uppercase tracking-widest text-ink/40 hover:text-wine"
                    >
                      Verwijderen
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <OrderSummary quantity={quantity} total={total} variant="cart" />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
