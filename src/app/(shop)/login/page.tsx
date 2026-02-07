"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BrutalButton } from "@/components/ui/BrutalButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (authError) {
      setError("Er ging iets mis. Probeer het opnieuw.");
      return;
    }

    setSent(true);
  }

  const inputClass =
    "w-full font-body text-base border-2 border-ink px-4 py-3 bg-offwhite focus:outline-none focus:border-wine placeholder:text-ink/30";

  if (sent) {
    return (
      <div className="bg-offwhite min-h-screen section-padding">
        <div className="container-brutal max-w-md text-center py-20">
          <div className="border-brutal-lg border-ink bg-offwhite brutal-shadow-lg p-8 md:p-12">
            <span className="font-display text-5xl block mb-4">📧</span>
            <h1 className="font-display text-display-sm text-ink mb-4">
              CHECK JE MAIL
            </h1>
            <p className="font-body text-base text-ink/70 mb-2">
              We hebben een inloglink gestuurd naar:
            </p>
            <p className="font-display text-lg font-bold text-wine mb-6">
              {email}
            </p>
            <p className="font-accent text-[10px] uppercase tracking-widest text-ink/40">
              Klik op de link in de mail om in te loggen · Check ook je spam
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-offwhite min-h-screen section-padding">
      <div className="container-brutal max-w-md py-20">
        <h1 className="font-display text-display-md text-ink mb-2 text-center">
          INLOGGEN
        </h1>
        <p className="font-body text-base text-ink/70 text-center mb-8">
          Log in met je e-mailadres. We sturen je een magic link.
        </p>

        <form
          onSubmit={handleSubmit}
          className="border-brutal border-ink bg-offwhite brutal-shadow p-6 space-y-4"
        >
          <input
            type="email"
            required
            placeholder="E-mailadres"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />

          {error && (
            <div className="border-2 border-wine bg-wine/10 p-3">
              <p className="font-body text-sm text-wine">{error}</p>
            </div>
          )}

          <BrutalButton
            variant="primary"
            size="lg"
            onClick={() => {}}
            className="w-full"
          >
            {loading ? "Even geduld..." : "Stuur inloglink"}
          </BrutalButton>
        </form>

        <p className="font-accent text-[10px] uppercase tracking-widest text-ink/40 text-center mt-6">
          Nog geen account? Geen probleem — we maken er automatisch een aan.
        </p>
      </div>
    </div>
  );
}
