import { lazy, Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { AgeGate } from "@/components/compliance/AgeGate";
import { CookieConsent } from "@/components/compliance/CookieConsent";

const CursorTrail = lazy(() =>
  import("@/components/effects/CursorTrail").then((m) => ({
    default: m.CursorTrail,
  })),
);

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <CursorTrail />
      </Suspense>
      <AgeGate />
      <Header />
      <CartDrawer />
      <main className="pt-14">{children}</main>
      <Footer />
      <CookieConsent />
    </>
  );
}
