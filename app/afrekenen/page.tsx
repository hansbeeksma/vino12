'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/lib/cart-store'
import { checkoutSchema } from '@/lib/checkout-schema'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function CheckoutPage() {
  const { quantity, total } = useCart()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})

    const formData = new FormData(e.currentTarget)
    const raw = {
      email: formData.get('email') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      phone: formData.get('phone') as string,
      street: formData.get('street') as string,
      houseNumber: formData.get('houseNumber') as string,
      houseNumberAddition: (formData.get('houseNumberAddition') as string) || '',
      postalCode: formData.get('postalCode') as string,
      city: formData.get('city') as string,
      ageConfirmed: formData.get('ageConfirmed') === 'on',
      termsAccepted: formData.get('termsAccepted') === 'on',
    }

    const result = checkoutSchema.safeParse(raw)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...result.data, quantity }),
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        setErrors({ form: 'Er ging iets mis. Probeer het opnieuw.' })
      }
    } catch {
      setErrors({ form: 'Er ging iets mis. Probeer het opnieuw.' })
    } finally {
      setLoading(false)
    }
  }

  if (quantity === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-offwhite pt-20">
          <div className="container-brutal px-4 py-12 md:px-8 text-center">
            <p className="font-display text-2xl text-ink/50 mb-4">Je winkelwagen is leeg</p>
            <Link
              href="/"
              className="inline-block font-accent text-xs font-bold uppercase tracking-wider bg-wine text-champagne px-8 py-4 border-2 border-ink brutal-shadow brutal-hover"
            >
              Terug naar Vino12
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

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
            <Link href="/winkelwagen" className="hover:text-wine">
              Winkelwagen
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink">Afrekenen</span>
          </nav>

          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink mb-8">Afrekenen</h1>

          {errors.form && (
            <div className="border-2 border-wine bg-wine/10 p-4 mb-6">
              <p className="font-body text-base text-wine">{errors.form}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Fields */}
              <div className="lg:col-span-2 space-y-8">
                {/* Contact */}
                <fieldset className="border-brutal border-ink p-6">
                  <legend className="font-accent text-xs uppercase tracking-widest text-ink px-2">
                    Contactgegevens
                  </legend>
                  <div className="space-y-4">
                    <FormField
                      name="email"
                      label="E-mailadres"
                      type="email"
                      placeholder="jouw@email.nl"
                      error={errors.email}
                      autoComplete="email"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        name="firstName"
                        label="Voornaam"
                        placeholder="Jan"
                        error={errors.firstName}
                        autoComplete="given-name"
                      />
                      <FormField
                        name="lastName"
                        label="Achternaam"
                        placeholder="Jansen"
                        error={errors.lastName}
                        autoComplete="family-name"
                      />
                    </div>
                    <FormField
                      name="phone"
                      label="Telefoonnummer"
                      type="tel"
                      placeholder="0612345678"
                      error={errors.phone}
                      autoComplete="tel"
                    />
                  </div>
                </fieldset>

                {/* Address */}
                <fieldset className="border-brutal border-ink p-6">
                  <legend className="font-accent text-xs uppercase tracking-widest text-ink px-2">
                    Bezorgadres
                  </legend>
                  <div className="space-y-4">
                    <FormField
                      name="street"
                      label="Straatnaam"
                      placeholder="Keizersgracht"
                      error={errors.street}
                      autoComplete="address-line1"
                    />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <FormField
                        name="houseNumber"
                        label="Huisnr."
                        placeholder="123"
                        error={errors.houseNumber}
                      />
                      <FormField
                        name="houseNumberAddition"
                        label="Toevoeging"
                        placeholder="A"
                        error={errors.houseNumberAddition}
                      />
                      <FormField
                        name="postalCode"
                        label="Postcode"
                        placeholder="1234 AB"
                        error={errors.postalCode}
                        autoComplete="postal-code"
                      />
                    </div>
                    <FormField
                      name="city"
                      label="Plaats"
                      placeholder="Amsterdam"
                      error={errors.city}
                      autoComplete="address-level2"
                    />
                  </div>
                </fieldset>

                {/* Confirmations */}
                <fieldset className="border-brutal border-ink p-6">
                  <legend className="font-accent text-xs uppercase tracking-widest text-ink px-2">
                    Bevestigingen
                  </legend>
                  <div className="space-y-4">
                    <CheckboxField
                      name="ageConfirmed"
                      label="Ik bevestig dat ik 18 jaar of ouder ben"
                      error={errors.ageConfirmed}
                    />
                    <CheckboxField
                      name="termsAccepted"
                      label={
                        <>
                          Ik ga akkoord met de{' '}
                          <Link href="/voorwaarden" className="text-wine underline" target="_blank">
                            algemene voorwaarden
                          </Link>{' '}
                          en het{' '}
                          <Link href="/privacy" className="text-wine underline" target="_blank">
                            privacybeleid
                          </Link>
                        </>
                      }
                      error={errors.termsAccepted}
                    />
                  </div>
                </fieldset>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="border-brutal border-ink bg-champagne/20 p-6 sticky top-24">
                  <h3 className="font-display text-xl font-bold mb-6">Bestelling</h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between font-body text-base">
                      <span className="text-ink/60">{quantity}x Vino12 Box</span>
                      <span>€{total}</span>
                    </div>
                    <div className="flex justify-between font-body text-base">
                      <span className="text-ink/60">Verzendkosten</span>
                      <span className="text-emerald font-bold">Gratis</span>
                    </div>
                  </div>

                  <div className="border-t-2 border-ink pt-4 mb-6">
                    <div className="flex justify-between items-baseline">
                      <span className="font-accent text-xs uppercase tracking-widest">Totaal</span>
                      <span className="font-display text-3xl font-bold text-wine">€{total}</span>
                    </div>
                    <p className="font-accent text-[10px] text-ink/40 uppercase tracking-widest mt-1">
                      Inclusief BTW
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full font-accent text-base font-bold uppercase tracking-wider bg-wine text-champagne px-8 py-4 border-brutal border-ink brutal-shadow brutal-hover disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Laden...' : 'Bestelling plaatsen →'}
                  </button>

                  <p className="font-accent text-[10px] text-ink/40 uppercase tracking-widest text-center mt-4">
                    Je wordt doorgestuurd naar de betaalpagina
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}

function FormField({
  name,
  label,
  type = 'text',
  placeholder,
  error,
  autoComplete,
}: {
  name: string
  label: string
  type?: string
  placeholder?: string
  error?: string
  autoComplete?: string
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block font-accent text-xs uppercase tracking-widest text-ink/60 mb-1"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`w-full px-4 py-3 border-2 font-body text-base bg-offwhite ${
          error ? 'border-wine' : 'border-ink'
        } focus:outline-none focus:border-wine`}
      />
      {error && <p className="font-body text-sm text-wine mt-1">{error}</p>}
    </div>
  )
}

function CheckboxField({
  name,
  label,
  error,
}: {
  name: string
  label: React.ReactNode
  error?: string
}) {
  return (
    <div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          name={name}
          className="mt-1 h-5 w-5 border-2 border-ink accent-wine flex-shrink-0"
        />
        <span className="font-body text-base text-ink">{label}</span>
      </label>
      {error && <p className="font-body text-sm text-wine mt-1 ml-8">{error}</p>}
    </div>
  )
}
