import Link from 'next/link'

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
            <h4 className="font-accent text-xs uppercase tracking-widest mb-4 text-wine">Info</h4>
            <ul className="space-y-2 font-body text-lg">
              <li>
                <a href="#collectie" className="hover:text-wine">
                  De Collectie
                </a>
              </li>
              <li>
                <a href="#reis" className="hover:text-wine">
                  Wijnreis
                </a>
              </li>
              <li>
                <a href="#filosofie" className="hover:text-wine">
                  Filosofie
                </a>
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
                  21+ | Drink met mate
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t-2 border-champagne/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <p className="font-accent text-xs text-champagne/40">
              &copy; 2026 Vino12. Alle rechten voorbehouden.
            </p>
            <nav className="flex gap-4">
              <Link
                href="/voorwaarden"
                className="font-accent text-xs text-champagne/40 hover:text-wine"
              >
                Algemene Voorwaarden
              </Link>
              <Link
                href="/privacy"
                className="font-accent text-xs text-champagne/40 hover:text-wine"
              >
                Privacy
              </Link>
            </nav>
          </div>
          <p className="font-accent text-xs text-champagne/30 text-center">
            Concept prototype — niet voor commercieel gebruik
          </p>
        </div>
      </div>
    </footer>
  )
}
