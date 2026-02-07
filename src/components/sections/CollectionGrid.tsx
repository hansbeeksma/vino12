"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { WineRow } from "@/lib/api/wines";
import type { WineType, WineBody } from "@/lib/schemas/wine";
import { WineCard } from "@/components/wine/WineCard";
import { SectionLabel } from "@/components/ui/SectionLabel";

type TypeFilter = "all" | WineType;
type BodyFilter = "all" | WineBody;
type SortOption = "name_asc" | "price_asc" | "price_desc" | "body_asc";

interface CollectionGridProps {
  wines: WineRow[];
}

const TYPE_FILTERS: { label: string; value: TypeFilter }[] = [
  { label: "Alles", value: "all" },
  { label: "Rood", value: "red" },
  { label: "Wit", value: "white" },
];

const BODY_FILTERS: { label: string; value: BodyFilter }[] = [
  { label: "Alle body", value: "all" },
  { label: "Light", value: "light" },
  { label: "Light-Medium", value: "medium_light" },
  { label: "Medium", value: "medium" },
  { label: "Medium-Full", value: "medium_full" },
  { label: "Full", value: "full" },
];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Naam A-Z", value: "name_asc" },
  { label: "Prijs laag-hoog", value: "price_asc" },
  { label: "Prijs hoog-laag", value: "price_desc" },
  { label: "Body licht-vol", value: "body_asc" },
];

const BODY_ORDER: Record<string, number> = {
  light: 1,
  medium_light: 2,
  medium: 3,
  medium_full: 4,
  full: 5,
};

export function CollectionGrid({ wines }: CollectionGridProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [typeFilter, setTypeFilter] = useState<TypeFilter>(
    (searchParams.get("type") as TypeFilter) || "all",
  );
  const [bodyFilter, setBodyFilter] = useState<BodyFilter>(
    (searchParams.get("body") as BodyFilter) || "all",
  );
  const [sort, setSort] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "name_asc",
  );

  const regions = useMemo(() => {
    const unique = new Map<string, string>();
    for (const w of wines) {
      if (w.region) {
        unique.set(w.region.id, w.region.name);
      }
    }
    return Array.from(unique, ([id, name]) => ({ id, name })).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [wines]);

  const [regionFilter, setRegionFilter] = useState<string>(
    searchParams.get("region") || "all",
  );

  function updateUrl(params: Record<string, string>) {
    const current = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(params)) {
      if (value === "all" || value === "name_asc") {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    }
    const qs = current.toString();
    router.replace(qs ? `?${qs}` : "?", { scroll: false });
  }

  const filtered = useMemo(() => {
    let result = wines;

    if (typeFilter !== "all") {
      result = result.filter((w) => w.type === typeFilter);
    }
    if (bodyFilter !== "all") {
      result = result.filter((w) => w.body === bodyFilter);
    }
    if (regionFilter !== "all") {
      result = result.filter((w) => w.region?.id === regionFilter);
    }

    const sorted = [...result];
    switch (sort) {
      case "price_asc":
        sorted.sort((a, b) => a.price_cents - b.price_cents);
        break;
      case "price_desc":
        sorted.sort((a, b) => b.price_cents - a.price_cents);
        break;
      case "body_asc":
        sorted.sort(
          (a, b) =>
            (BODY_ORDER[a.body ?? "medium"] ?? 3) -
            (BODY_ORDER[b.body ?? "medium"] ?? 3),
        );
        break;
      default:
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    return sorted;
  }, [wines, typeFilter, bodyFilter, regionFilter, sort]);

  const activeFilterCount =
    (typeFilter !== "all" ? 1 : 0) +
    (bodyFilter !== "all" ? 1 : 0) +
    (regionFilter !== "all" ? 1 : 0);

  return (
    <section id="collectie" className="section-padding bg-offwhite">
      <div className="container-brutal">
        <SectionLabel>De Collectie</SectionLabel>
        <h2 className="font-display text-display-md text-ink mb-8">
          12 WIJNEN.
          <br />
          <span className="text-wine">ZORGVULDIG GEKOZEN.</span>
        </h2>

        {/* Type filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setTypeFilter(f.value);
                updateUrl({ type: f.value });
              }}
              className={`font-accent text-xs font-bold uppercase tracking-widest px-4 py-2.5 border-2 border-ink transition-colors ${
                typeFilter === f.value
                  ? "bg-ink text-offwhite"
                  : "bg-offwhite text-ink brutal-shadow brutal-hover"
              }`}
            >
              {f.label}
              <span className="ml-1 text-[10px]">
                (
                {f.value === "all"
                  ? wines.length
                  : wines.filter((w) => w.type === f.value).length}
                )
              </span>
            </button>
          ))}
        </div>

        {/* Secondary filters row */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          {/* Body filter */}
          <select
            value={bodyFilter}
            onChange={(e) => {
              const val = e.target.value as BodyFilter;
              setBodyFilter(val);
              updateUrl({ body: val });
            }}
            className="font-accent text-xs uppercase tracking-widest border-2 border-ink px-3 py-2 bg-offwhite focus:outline-none focus:border-wine cursor-pointer"
          >
            {BODY_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>

          {/* Region filter */}
          <select
            value={regionFilter}
            onChange={(e) => {
              setRegionFilter(e.target.value);
              updateUrl({ region: e.target.value });
            }}
            className="font-accent text-xs uppercase tracking-widest border-2 border-ink px-3 py-2 bg-offwhite focus:outline-none focus:border-wine cursor-pointer"
          >
            <option value="all">Alle regio&apos;s</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => {
              const val = e.target.value as SortOption;
              setSort(val);
              updateUrl({ sort: val });
            }}
            className="font-accent text-xs uppercase tracking-widest border-2 border-ink px-3 py-2 bg-offwhite focus:outline-none focus:border-wine cursor-pointer ml-auto"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Active filter indicator + clear */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 mb-6">
            <span className="font-accent text-[10px] uppercase tracking-widest text-ink/50">
              {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}{" "}
              actief
            </span>
            <button
              onClick={() => {
                setTypeFilter("all");
                setBodyFilter("all");
                setRegionFilter("all");
                setSort("name_asc");
                router.replace("?", { scroll: false });
              }}
              className="font-accent text-[10px] uppercase tracking-widest text-wine underline hover:no-underline"
            >
              Wis filters
            </button>
          </div>
        )}

        {/* Results count */}
        <p className="font-accent text-xs text-ink/50 uppercase tracking-widest mb-4">
          {filtered.length} wijn{filtered.length !== 1 ? "en" : ""}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {filtered.map((wine) => (
            <WineCard key={wine.id} wine={wine} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="font-display text-2xl text-ink/30 mb-2">
              Geen wijnen gevonden
            </p>
            <p className="font-body text-base text-ink/50">
              Probeer andere filters of{" "}
              <button
                onClick={() => {
                  setTypeFilter("all");
                  setBodyFilter("all");
                  setRegionFilter("all");
                  router.replace("?", { scroll: false });
                }}
                className="text-wine underline hover:no-underline"
              >
                bekijk alle wijnen
              </button>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
