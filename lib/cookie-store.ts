import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CookiePreferences {
  necessary: true // always true, cannot be disabled
  functional: boolean
  analytics: boolean
  marketing: boolean
}

interface CookieConsentState {
  consented: boolean
  consentedAt: string | null
  preferences: CookiePreferences
  setConsent: (preferences: Omit<CookiePreferences, 'necessary'>) => void
  acceptAll: () => void
  rejectOptional: () => void
  reset: () => void
}

export const useCookieConsent = create<CookieConsentState>()(
  persist(
    (set) => ({
      consented: false,
      consentedAt: null,
      preferences: {
        necessary: true,
        functional: false,
        analytics: false,
        marketing: false,
      },

      setConsent: (prefs) =>
        set({
          consented: true,
          consentedAt: new Date().toISOString(),
          preferences: { necessary: true, ...prefs },
        }),

      acceptAll: () =>
        set({
          consented: true,
          consentedAt: new Date().toISOString(),
          preferences: {
            necessary: true,
            functional: true,
            analytics: true,
            marketing: true,
          },
        }),

      rejectOptional: () =>
        set({
          consented: true,
          consentedAt: new Date().toISOString(),
          preferences: {
            necessary: true,
            functional: false,
            analytics: false,
            marketing: false,
          },
        }),

      reset: () =>
        set({
          consented: false,
          consentedAt: null,
          preferences: {
            necessary: true,
            functional: false,
            analytics: false,
            marketing: false,
          },
        }),
    }),
    {
      name: 'vino12-cookie-consent',
    },
  ),
)
