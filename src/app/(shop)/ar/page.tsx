import type { Metadata } from "next";
import wines from "@/data/wines.json";
import { ARPageClient } from "./client";

export const metadata: Metadata = {
  title: "AR Wijnlabels | VINO12",
  description:
    "Scan wijnflessen met augmented reality en ontdek direct alle wijn informatie.",
};

export default function ARPage() {
  return (
    <section className="min-h-screen">
      <ARPageClient wines={wines} />
    </section>
  );
}
