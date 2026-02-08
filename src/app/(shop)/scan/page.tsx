import type { Metadata } from "next";
import { ScanPageClient } from "./client";

export const metadata: Metadata = {
  title: "Wijn Scanner | VINO12",
  description:
    "Scan een wijnetiket met je camera en vind de beste match in onze collectie.",
};

export default function ScanPage() {
  return (
    <section className="min-h-screen">
      <ScanPageClient />
    </section>
  );
}
