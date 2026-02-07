"use client";

import { useState } from "react";
import { BrutalButton } from "@/components/ui/BrutalButton";

const AGE_COOKIE = "vino12_age_verified";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`;
}

export function AgeGate() {
  const [show, setShow] = useState(() => {
    if (typeof document === "undefined") return false;
    return !getCookie(AGE_COOKIE);
  });

  function handleConfirm() {
    setCookie(AGE_COOKIE, "true", COOKIE_MAX_AGE);
    setShow(false);
  }

  function handleDeny() {
    window.location.href = "https://www.google.com";
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-100 bg-ink/80 flex items-center justify-center p-4">
      <div className="bg-offwhite border-brutal-lg border-ink brutal-shadow-lg p-8 md:p-12 max-w-md w-full text-center">
        <div className="mb-6">
          <span className="font-display text-5xl block mb-2">🍷</span>
          <h2 className="font-display text-display-sm text-ink mb-2">
            BEN JE 18+?
          </h2>
          <p className="font-body text-base text-ink/70">
            Je moet 18 jaar of ouder zijn om deze website te bezoeken. Wij
            verkopen uitsluitend alcoholische dranken aan volwassenen.
          </p>
        </div>

        <div className="space-y-3">
          <BrutalButton
            variant="primary"
            size="lg"
            onClick={handleConfirm}
            className="w-full"
          >
            Ja, ik ben 18 of ouder
          </BrutalButton>
          <button
            onClick={handleDeny}
            className="w-full font-accent text-sm uppercase tracking-widest text-ink/50 hover:text-ink py-2"
          >
            Nee, ik ben jonger dan 18
          </button>
        </div>

        <p className="font-accent text-[9px] uppercase tracking-widest text-ink/30 mt-6">
          Conform de Drank- en Horecawet · Nix18
        </p>
      </div>
    </div>
  );
}
