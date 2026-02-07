"use client";

import { useState, useEffect } from "react";

const CONSENT_COOKIE = "vino12_cookie_consent";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAge};SameSite=Lax`;
}

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!getCookie(CONSENT_COOKIE)) {
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleAccept() {
    setCookie(CONSENT_COOKIE, "all", COOKIE_MAX_AGE);
    setShow(false);
  }

  function handleNecessaryOnly() {
    setCookie(CONSENT_COOKIE, "necessary", COOKIE_MAX_AGE);
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-90 p-4">
      <div className="container-brutal max-w-2xl mx-auto bg-offwhite border-brutal border-ink brutal-shadow p-4 md:p-6">
        <p className="font-body text-sm text-ink/80 mb-4">
          VINO12 gebruikt cookies voor een betere winkelervaring. Essentiële
          cookies zijn noodzakelijk voor het functioneren van de webshop.{" "}
          <a href="/privacy" className="underline text-wine hover:text-wine/80">
            Lees ons privacybeleid
          </a>
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAccept}
            className="font-accent text-xs font-bold uppercase tracking-wider bg-wine text-champagne px-6 py-2.5 border-2 border-ink brutal-shadow brutal-hover"
          >
            Accepteer alles
          </button>
          <button
            onClick={handleNecessaryOnly}
            className="font-accent text-xs font-bold uppercase tracking-wider bg-offwhite text-ink px-6 py-2.5 border-2 border-ink brutal-shadow brutal-hover"
          >
            Alleen noodzakelijk
          </button>
        </div>
      </div>
    </div>
  );
}
