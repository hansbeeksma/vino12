import type { Metadata } from 'next'
import { BrutalButton } from '@/components/ui/BrutalButton'

export const metadata: Metadata = {
  title: 'Betaling geannuleerd — Vino12',
  description: 'Je betaling is geannuleerd. Je kunt het opnieuw proberen.',
}

export default function CancelledPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-offwhite px-4">
      <div className="max-w-lg text-center">
        <div className="border-brutal border-ink bg-offwhite brutal-shadow p-8 md:p-12 mb-8">
          <p className="font-accent text-xs uppercase tracking-[0.3em] text-ink/50 mb-4">
            Betaling geannuleerd
          </p>
          <h1 className="font-display text-display-lg text-ink mb-4">GEANNULEERD</h1>
          <p className="font-body text-xl text-ink/70 mb-6">
            Je betaling is niet voltooid. Je winkelwagen is bewaard — je kunt het op elk moment
            opnieuw proberen.
          </p>
          <div className="w-16 h-1 bg-ink/20 mx-auto" />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <BrutalButton href="/winkelwagen">Terug naar winkelwagen</BrutalButton>
          <BrutalButton variant="outline" href="/">
            Terug naar Vino12
          </BrutalButton>
        </div>
      </div>
    </main>
  )
}
