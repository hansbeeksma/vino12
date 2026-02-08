import type { Metadata } from "next";
import { redirect } from "next/navigation";
import wines from "@/data/wines.json";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { ARPageClient } from "./client";

export const metadata: Metadata = {
  title: "AR Wijnlabels | VINO12",
  description:
    "Scan wijnflessen met augmented reality en ontdek direct alle wijn informatie.",
};

export default function ARPage() {
  if (!isFeatureEnabled("ar.enabled")) {
    redirect("/wijnen");
  }

  return (
    <section className="min-h-screen">
      <ARPageClient wines={wines} />
    </section>
  );
}
