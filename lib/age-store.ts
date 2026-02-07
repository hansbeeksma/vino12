import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const AGE_COOKIE_NAME = 'vino12-age-verified'
const AGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

function setAgeCookie(verified: boolean) {
  if (typeof document === 'undefined') return
  if (verified) {
    document.cookie = `${AGE_COOKIE_NAME}=1; path=/; max-age=${AGE_COOKIE_MAX_AGE}; SameSite=Lax`
  } else {
    document.cookie = `${AGE_COOKIE_NAME}=; path=/; max-age=0`
  }
}

interface AgeVerificationState {
  verified: boolean
  verifiedAt: string | null
  verify: () => void
  reset: () => void
}

export const useAgeVerification = create<AgeVerificationState>()(
  persist(
    (set) => ({
      verified: false,
      verifiedAt: null,

      verify: () => {
        setAgeCookie(true)
        set({
          verified: true,
          verifiedAt: new Date().toISOString(),
        })
      },

      reset: () => {
        setAgeCookie(false)
        set({
          verified: false,
          verifiedAt: null,
        })
      },
    }),
    {
      name: 'vino12-age-verified',
    },
  ),
)
