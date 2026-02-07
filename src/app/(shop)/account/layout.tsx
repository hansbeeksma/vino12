import Link from "next/link";

const ACCOUNT_NAV = [
  { href: "/account", label: "Overzicht" },
  { href: "/account/profiel", label: "Profiel" },
  { href: "/account/adressen", label: "Adressen" },
  { href: "/account/bestellingen", label: "Bestellingen" },
  { href: "/account/wijnclub", label: "Wijnclub" },
  { href: "/account/privacy", label: "Privacy & data" },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-offwhite min-h-screen section-padding">
      <div className="container-brutal max-w-3xl">
        <nav className="flex flex-wrap gap-2 mb-8">
          {ACCOUNT_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-accent text-[10px] uppercase tracking-widest text-ink px-3 py-2 border-2 border-ink hover:bg-ink hover:text-offwhite transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </div>
  );
}
