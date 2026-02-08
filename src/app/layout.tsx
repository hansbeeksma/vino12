import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Mono, Darker_Grotesque } from "next/font/google";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-accent",
  display: "swap",
});

const darkerGrotesque = Darker_Grotesque({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://vino12.com",
  ),
  title: {
    default: "Vino12 — 6 Rood. 6 Wit. Perfecte Balans.",
    template: "%s — Vino12",
  },
  description:
    "12 premium wijnen, zorgvuldig gecureerd. Van licht en fris tot vol en complex. Ontdek jouw perfecte box.",
  keywords: [
    "wijn",
    "wijnbox",
    "premium wijnen",
    "rode wijn",
    "witte wijn",
    "VINO12",
    "online wijn kopen",
  ],
  openGraph: {
    title: "Vino12 — 6 Rood. 6 Wit. Perfecte Balans.",
    description:
      "12 premium wijnen, zorgvuldig gecureerd. Van licht en fris tot vol en complex.",
    type: "website",
    locale: "nl_NL",
    siteName: "Vino12",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vino12 — Premium Wijnbox",
    description: "12 premium wijnen. 6 rood. 6 wit. Perfecte balans.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${ibmPlexMono.variable} ${spaceMono.variable} ${darkerGrotesque.variable}`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#722F37" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Vino12" />
        <link rel="apple-touch-icon" href="/images/icons/icon-192x192.png" />
      </head>
      <body className="bg-offwhite text-ink antialiased">{children}</body>
    </html>
  );
}
