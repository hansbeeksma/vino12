import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-ink text-champagne border-t-brutal border-wine">
      <div className="container-brutal px-4 py-12 md:px-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div>
            <h3 className="font-display text-2xl font-bold mb-4">
              VINO<span className="text-wine">12</span>
            </h3>
            <p className="font-body text-lg text-champagne/70 max-w-xs">
              12 premium wijnen. Zorgvuldig gecureerd. Van licht tot vol.
            </p>
          </div>
          <div>
            <h4 className="font-accent text-xs uppercase tracking-widest mb-4 text-wine">
              Info
            </h4>
            <ul className="space-y-2 font-body text-lg">
              <li>
                <Link href="/wijnen" className="hover:text-wine">
                  De Collectie
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-wine">
                  Privacybeleid
                </Link>
              </li>
              <li>
                <Link href="/voorwaarden" className="hover:text-wine">
                  Algemene Voorwaarden
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-accent text-xs uppercase tracking-widest mb-4 text-wine">
              Contact
            </h4>
            <ul className="space-y-2 font-body text-lg">
              <li>hallo@vino12.com</li>
              <li>Amsterdam, NL</li>
              <li className="pt-2">
                <span className="font-accent text-xs uppercase tracking-widest text-champagne/50">
                  Nix18 | Drink met mate
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t-2 border-champagne/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-accent text-xs text-champagne/40">
            &copy; 2026 Vino12. Alle rechten voorbehouden.
          </p>
          <p className="font-accent text-xs text-champagne/40">
            Concept prototype — niet voor commercieel gebruik
          </p>
        </div>
      </div>
    </footer>
  );
}
