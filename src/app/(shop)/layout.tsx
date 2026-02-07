export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-2xl font-bold">
            VINO12
          </a>
          <div className="flex items-center gap-6">
            <a href="/wijnen" className="hover:underline">
              Wijnen
            </a>
            <a href="/winkelwagen" className="hover:underline">
              Winkelwagen
            </a>
          </div>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} VINO12. Alle rechten voorbehouden.
          </p>
          <p className="mt-1">
            Alcohol wordt alleen verkocht aan personen van 18 jaar en ouder.
          </p>
        </div>
      </footer>
    </div>
  );
}
