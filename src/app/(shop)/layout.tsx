import { lazy, Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { AgeGate } from "@/components/compliance/AgeGate";
import { CookieConsent } from "@/components/compliance/CookieConsent";
import { FeatureFlag } from "@/components/ui/FeatureFlag";

const VoiceCommandWrapper = lazy(() =>
  import("@/components/voice/VoiceCommandWrapper").then((m) => ({
    default: m.VoiceCommandWrapper,
  })),
);

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
      <FeatureFlag flag="effects.cursor_trail">
        <Suspense fallback={null}>
          <CursorTrail />
        </Suspense>
      </FeatureFlag>
      <AgeGate />
      <Header />
      <CartDrawer />
      <main className="pt-14">{children}</main>
      <Footer />
      <CookieConsent />
      <FeatureFlag flag="voice.enabled">
        <Suspense fallback={null}>
          <VoiceCommandWrapper />
        </Suspense>
      </FeatureFlag>
    </>
  );
}
