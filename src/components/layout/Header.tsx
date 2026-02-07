"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CartButton } from "@/components/shop/CartButton";
import { createClient } from "@/lib/supabase/client";

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
          className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-ink"
        >
          VINO<span className="text-wine">12</span>
        </Link>
        <nav className="flex items-center gap-4 md:gap-6">
          <Link
            href="/wijnen"
            className="font-accent text-xs uppercase tracking-widest text-ink hover:text-wine"
          >
            Collectie
          </Link>
          <Link
            href="/blog"
            className="font-accent text-xs uppercase tracking-widest text-ink hover:text-wine hidden md:block"
          >
            Blog
          </Link>
          <Link
            href={isLoggedIn ? "/account" : "/login"}
            className="font-accent text-xs uppercase tracking-widest text-ink hover:text-wine hidden md:block"
          >
            {isLoggedIn ? "Account" : "Inloggen"}
          </Link>
          <CartButton />
        </nav>
      </div>
    </header>
  );
}
