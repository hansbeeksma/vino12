export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r bg-gray-50 p-4">
        <h2 className="text-lg font-bold mb-4">VINO12 Admin</h2>
        <nav className="space-y-2">
          <a
            href="/admin"
            className="block px-3 py-2 rounded hover:bg-gray-200"
          >
            Dashboard
          </a>
          <a
            href="/admin/producten"
            className="block px-3 py-2 rounded hover:bg-gray-200"
          >
            Producten
          </a>
          <a
            href="/admin/bestellingen"
            className="block px-3 py-2 rounded hover:bg-gray-200"
          >
            Bestellingen
          </a>
          <a
            href="/admin/klanten"
            className="block px-3 py-2 rounded hover:bg-gray-200"
          >
            Klanten
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
