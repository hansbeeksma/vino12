import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | VINO12",
  robots: { index: false, follow: false },
};

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/bestellingen", label: "Bestellingen" },
  { href: "/admin/wijnen", label: "Wijnen" },
  { href: "/admin/klanten", label: "Klanten" },
  { href: "/admin/ideas", label: "Ideeën" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-offwhite">
      <aside className="w-56 border-r-2 border-ink bg-champagne p-4 shrink-0">
        <Link
          href="/admin"
          className="font-display text-xl font-bold text-ink block mb-6"
        >
          VINO<span className="text-wine">12</span>
          <span className="font-accent text-[10px] uppercase tracking-widest text-ink/40 block">
            Admin
          </span>
        </Link>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block font-accent text-xs uppercase tracking-widest text-ink px-3 py-2.5 border-2 border-transparent hover:border-ink hover:bg-offwhite"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 pt-4 border-t border-ink/20">
          <Link
            href="/"
            className="font-accent text-[10px] uppercase tracking-widest text-ink/40 hover:text-wine"
          >
            ← Terug naar shop
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-8 overflow-x-auto">{children}</main>
    </div>
  );
}
