import { Suspense } from "react";
import type { Metadata } from "next";
import { getWines } from "@/lib/api/wines";
import { CollectionGrid } from "@/components/sections/CollectionGrid";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SearchBar } from "@/components/search/SearchBar";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Wijnen | VINO12",
  description:
    "Ontdek ons assortiment van 12 premium wijnen. 6 rode en 6 witte wijnen, van licht tot vol.",
};

export default async function WijnenPage() {
  const wines = await getWines();

  return (
    <div className="bg-offwhite min-h-screen">
      <section className="section-padding">
        <div className="container-brutal">
          <SectionLabel>Alle Wijnen</SectionLabel>
          <h1 className="font-display text-display-md text-ink mb-4">
            ONZE
            <br />
            <span className="text-wine">COLLECTIE.</span>
          </h1>
          <p className="font-body text-xl text-ink/70 max-w-lg mb-8">
            12 premium wijnen. Elke fles vertelt een verhaal van regio, druif en
            vakmanschap.
          </p>
          <SearchBar />
        </div>
      </section>
      <Suspense>
        <CollectionGrid wines={wines} />
      </Suspense>
    </div>
  );
}
