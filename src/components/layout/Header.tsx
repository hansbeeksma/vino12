"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CartButton } from "@/components/shop/CartButton";
import { createClient } from "@/lib/supabase/client";
import { isFeatureEnabled } from "@/lib/feature-flags";

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-offwhite border-b-brutal border-ink">
      <div className="container-brutal flex items-center justify-between px-4 py-3 md:px-8">
        <Link
          href="/"
          className="group font-display text-xl md:text-2xl lg:text-3xl font-bold text-ink"
        >
          VINO
          <span className="text-wine group-hover:text-gold transition-colors duration-300">
            12
          </span>
        </Link>
        <nav className="flex items-center gap-4 md:gap-6">
          <Link
            href="/wijnen"
            className="font-accent text-xs uppercase tracking-widest text-ink hover:text-gold transition-colors duration-200"
          >
            Collectie
          </Link>
          {isFeatureEnabled("ar.enabled") && (
            <Link
              href="/ar"
              className="font-accent text-xs uppercase tracking-widest text-ink hover:text-gold transition-colors duration-200 hidden md:block"
              title="AR Wijnlabels"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="inline-block"
              >
                <path d="M2 7l10-5 10 5-10 5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </Link>
          )}
          {isFeatureEnabled("cv.scanner") && (
            <Link
              href="/scan"
              className="font-accent text-xs uppercase tracking-widest text-ink hover:text-gold transition-colors duration-200 hidden md:block"
              title="Wijn Scanner"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="inline-block"
              >
                <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </Link>
          )}
          <Link
            href={isLoggedIn ? "/account" : "/login"}
            className="font-accent text-xs uppercase tracking-widest text-ink hover:text-gold transition-colors duration-200 hidden md:block"
          >
            {isLoggedIn ? "Account" : "Inloggen"}
          </Link>
          <CartButton />
        </nav>
      </div>
    </header>
  );
}
