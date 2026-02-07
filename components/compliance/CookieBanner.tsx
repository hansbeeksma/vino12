'use client'

import { useCookieConsent } from '@/lib/cookie-store'
import { useState } from 'react'

export function CookieBanner() {
  const { consented, acceptAll, rejectOptional, setConsent } = useCookieConsent()
  const [showDetails, setShowDetails] = useState(false)
  const [functional, setFunctional] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  if (consented) return null

  function handleSavePreferences() {
    setConsent({ functional, analytics, marketing })
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[90] border-t-brutal border-ink bg-offwhite p-4 md:p-6 brutal-shadow-lg">
      <div className="mx-auto max-w-4xl">
        {!showDetails ? (
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <p className="font-body text-base text-ink">
                Wij gebruiken cookies om je ervaring te verbeteren. Je kunt kiezen welke cookies je
                accepteert.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={rejectOptional}
                className="px-4 py-2 font-accent text-xs font-bold uppercase tracking-wider text-ink border-2 border-ink brutal-hover"
              >
                Alleen noodzakelijk
              </button>
              <button
                onClick={() => setShowDetails(true)}
                className="px-4 py-2 font-accent text-xs font-bold uppercase tracking-wider text-ink border-2 border-ink brutal-hover"
              >
                Voorkeuren
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 font-accent text-xs font-bold uppercase tracking-wider text-champagne bg-wine border-2 border-ink brutal-shadow brutal-hover"
              >
                Alles accepteren
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-ink">Cookie voorkeuren</h3>

            <div className="space-y-3">
              <CookieCategory
                name="Noodzakelijk"
                description="Essentieel voor het functioneren van de website (winkelwagen, leeftijdsverificatie)."
                checked={true}
                disabled={true}
              />
              <CookieCategory
                name="Functioneel"
                description="Onthoudt je voorkeuren zoals taalinstelling."
                checked={functional}
                onChange={setFunctional}
              />
              <CookieCategory
                name="Analytisch"
                description="Helpt ons begrijpen hoe bezoekers de website gebruiken."
                checked={analytics}
                onChange={setAnalytics}
              />
              <CookieCategory
                name="Marketing"
                description="Gebruikt voor gepersonaliseerde advertenties."
                checked={marketing}
                onChange={setMarketing}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 font-accent text-xs font-bold uppercase tracking-wider text-ink/50 hover:text-ink"
              >
                Terug
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-4 py-2 font-accent text-xs font-bold uppercase tracking-wider text-champagne bg-wine border-2 border-ink brutal-shadow brutal-hover"
              >
                Voorkeuren opslaan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CookieCategory({
  name,
  description,
  checked,
  disabled,
  onChange,
}: {
  name: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange?: (value: boolean) => void
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 h-4 w-4 border-2 border-ink accent-wine"
      />
      <div>
        <span className="font-accent text-xs font-bold uppercase tracking-wider text-ink">
          {name}
          {disabled && <span className="ml-2 text-ink/40">(altijd aan)</span>}
        </span>
        <p className="font-body text-sm text-ink/60">{description}</p>
      </div>
    </label>
  )
}
