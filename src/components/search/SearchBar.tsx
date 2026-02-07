"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { typeColorHex, formatPriceShort } from "@/lib/utils";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  type: string;
  region: string | null;
  price_cents: number;
  image_url: string | null;
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-lg">
      <input
        type="search"
        placeholder="Zoek wijnen..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="w-full font-body text-base border-2 border-ink px-4 py-2.5 bg-offwhite focus:outline-none focus:border-wine placeholder:text-ink/30"
      />

      {open && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-offwhite border-2 border-ink brutal-shadow z-50 max-h-80 overflow-y-auto">
          {loading && (
            <p className="font-accent text-xs text-ink/50 p-4 text-center">
              Zoeken...
            </p>
          )}

          {!loading && results.length === 0 && (
            <p className="font-accent text-xs text-ink/50 p-4 text-center">
              Geen resultaten voor &quot;{query}&quot;
            </p>
          )}

          {results.map((wine) => (
            <Link
              key={wine.id}
              href={`/wijn/${wine.slug}`}
              onClick={() => {
                setOpen(false);
                setQuery("");
              }}
              className="flex items-center gap-3 p-3 hover:bg-champagne border-b border-ink/10 last:border-0"
            >
              <div
                className="w-3 h-3 border border-ink shrink-0"
                style={{
                  backgroundColor: typeColorHex(
                    wine.type as
                      | "red"
                      | "white"
                      | "rose"
                      | "sparkling"
                      | "dessert"
                      | "fortified"
                      | "orange",
                  ),
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm font-bold truncate">
                  {wine.name}
                </p>
                {wine.region && (
                  <p className="font-accent text-[10px] uppercase tracking-widest text-ink/50">
                    {wine.region}
                  </p>
                )}
              </div>
              <span className="font-accent text-xs font-bold text-wine shrink-0">
                {formatPriceShort(wine.price_cents)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
