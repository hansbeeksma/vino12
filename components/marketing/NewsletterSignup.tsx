'use client'

import { useState } from 'react'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setStatus('loading')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="border-brutal border-ink bg-champagne/30 p-8 text-center">
        <p className="font-display text-2xl font-bold text-ink mb-2">Bedankt!</p>
        <p className="font-body text-lg text-ink/60">Je ontvangt binnenkort onze wijnupdates.</p>
      </div>
    )
  }

  return (
    <div className="border-brutal border-ink bg-offwhite p-8">
      <h3 className="font-display text-2xl font-bold text-ink mb-2">Op de hoogte blijven?</h3>
      <p className="font-body text-lg text-ink/60 mb-6">
        Ontvang wijnverhalen, food pairings en exclusieve aanbiedingen.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jouw@email.nl"
          required
          className="flex-1 px-4 py-3 border-2 border-ink font-body text-base bg-offwhite focus:outline-none focus:border-wine"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="font-accent text-xs font-bold uppercase tracking-wider bg-wine text-champagne px-8 py-3 border-2 border-ink brutal-shadow brutal-hover disabled:opacity-50"
        >
          {status === 'loading' ? 'Laden...' : 'Aanmelden'}
        </button>
      </form>
      {status === 'error' && (
        <p className="font-body text-sm text-wine mt-2">
          Er ging iets mis. Probeer het later opnieuw.
        </p>
      )}
      <p className="font-accent text-[10px] text-ink/30 uppercase tracking-widest mt-3">
        Geen spam. Afmelden kan altijd.
      </p>
    </div>
  )
}
