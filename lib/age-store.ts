import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

      verify: () =>
        set({
          verified: true,
          verifiedAt: new Date().toISOString(),
        }),

      reset: () =>
        set({
          verified: false,
          verifiedAt: null,
        }),
    }),
    {
      name: 'vino12-age-verified',
    },
  ),
)
