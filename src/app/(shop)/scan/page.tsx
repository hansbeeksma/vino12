import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { ScanPageClient } from "./client";

export const metadata: Metadata = {
  title: "Wijn Scanner | VINO12",
  description:
    "Scan een wijnetiket met je camera en vind de beste match in onze collectie.",
};

export default function ScanPage() {
  if (!isFeatureEnabled("cv.scanner")) {
    redirect("/wijnen");
  }

  return (
    <section className="min-h-screen">
      <ScanPageClient />
    </section>
  );
}
