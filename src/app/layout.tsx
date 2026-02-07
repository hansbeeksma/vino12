import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "VINO12 | Premium Wijnen Online",
    template: "%s | VINO12",
  },
  description:
    "Ontdek premium wijnen bij VINO12. Rode, witte en mousserende wijnen direct thuisbezorgd. Gratis verzending vanaf €75.",
  keywords: [
    "wijn",
    "online wijn kopen",
    "wijnen",
    "rode wijn",
    "witte wijn",
    "VINO12",
  ],
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: "VINO12",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
