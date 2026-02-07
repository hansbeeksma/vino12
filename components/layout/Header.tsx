"use client";

import Link from "next/link";
import { CartButton } from "@/components/shop/CartButton";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-offwhite border-b-brutal border-ink">
      <div className="container-brutal flex items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="font-display text-xl md:text-2xl lg:text-3xl font-bold text-ink">
          VINO<span className="text-wine">12</span>
        </Link>
        <nav className="flex items-center gap-4 md:gap-6">
          <a
            href="#collectie"
            className="font-accent text-xs uppercase tracking-widest text-ink hover:text-wine"
          >
            Collectie
          </a>
          <a
            href="#filosofie"
            className="font-accent text-xs uppercase tracking-widest text-ink hover:text-wine hidden md:block"
          >
            Filosofie
          </a>
          <CartButton />
        </nav>
      </div>
    </header>
  );
}
