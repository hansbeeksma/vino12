'use client'

import { useAgeVerification } from '@/lib/age-store'
import { useState } from 'react'

export function AgeGate() {
  const { verified, verify } = useAgeVerification()
  const [showDob, setShowDob] = useState(false)
  const [dob, setDob] = useState('')
  const [error, setError] = useState('')

  if (verified) return null

  function handleConfirm() {
    verify()
  }

  function handleDobSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!dob) {
      setError('Vul je geboortedatum in')
      return
    }

    const birthDate = new Date(dob)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    const isOldEnough =
      age > 18 ||
      (age === 18 && (monthDiff > 0 || (monthDiff === 0 && today.getDate() >= birthDate.getDate())))

    if (isOldEnough) {
      verify()
    } else {
      setError('Je moet 18 jaar of ouder zijn om deze website te bezoeken')
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md border-brutal-lg border-ink bg-offwhite p-8 brutal-shadow-lg">
        {/* Logo */}
        <div className="mb-6 text-center">
          <h1 className="font-display text-4xl font-bold text-ink">
            VINO<span className="text-wine">12</span>
          </h1>
        </div>

        {/* Title */}
        <h2 className="mb-2 text-center font-display text-2xl font-bold text-ink">
          Leeftijdsverificatie
        </h2>
        <p className="mb-6 text-center font-body text-lg text-ink/70">
          Je moet 18 jaar of ouder zijn om deze website te bezoeken.
        </p>

        {!showDob ? (
          <div className="space-y-3">
            <button
              onClick={handleConfirm}
              className="w-full bg-wine px-6 py-4 font-accent text-sm font-bold uppercase tracking-wider text-champagne border-brutal border-ink brutal-shadow brutal-hover"
            >
              Ja, ik ben 18 of ouder
            </button>
            <button
              onClick={() => setShowDob(true)}
              className="w-full bg-offwhite px-6 py-4 font-accent text-sm font-bold uppercase tracking-wider text-ink border-brutal border-ink brutal-hover"
            >
              Verifieer met geboortedatum
            </button>
          </div>
        ) : (
          <form onSubmit={handleDobSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="dob"
                className="mb-2 block font-accent text-xs uppercase tracking-widest text-ink/60"
              >
                Geboortedatum
              </label>
              <input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full border-brutal border-ink bg-offwhite px-4 py-3 font-body text-lg text-ink focus:outline-none focus:ring-2 focus:ring-wine"
              />
            </div>
            {error && (
              <p className="font-accent text-xs font-bold uppercase tracking-wider text-red-600">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-wine px-6 py-4 font-accent text-sm font-bold uppercase tracking-wider text-champagne border-brutal border-ink brutal-shadow brutal-hover"
            >
              Bevestig
            </button>
            <button
              type="button"
              onClick={() => {
                setShowDob(false)
                setError('')
              }}
              className="w-full px-6 py-2 font-accent text-xs uppercase tracking-widest text-ink/50 hover:text-ink"
            >
              Terug
            </button>
          </form>
        )}

        {/* Legal notice */}
        <p className="mt-6 text-center font-accent text-[10px] uppercase tracking-widest text-ink/30">
          Door verder te gaan bevestig je dat je 18 jaar of ouder bent.
          <br />
          Alcohol verkoop aan minderjarigen is verboden.
        </p>
      </div>
    </div>
  )
}
