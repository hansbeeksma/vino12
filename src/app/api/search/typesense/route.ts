import { NextRequest, NextResponse } from "next/server";
import {
  getTypesenseClient,
  isTypesenseAvailable,
  WINES_COLLECTION,
} from "@/lib/typesense";
import { searchWines } from "@/lib/api/wines";

export const dynamic = "force-dynamic";

interface TypesenseHit {
  document: {
    id: string;
    name: string;
    slug: string;
    type: string;
    body: string;
    grape: string;
    region: string;
    country: string;
    vintage: number;
    price_cents: number;
    alcohol_percentage: number;
    description: string;
    tasting_notes_nose: string[];
    tasting_notes_palate: string[];
    tasting_notes_finish: string;
    food_pairing: string[];
    is_active: boolean;
    is_featured: boolean;
  };
  highlights: Array<{
    field: string;
    snippet: string;
  }>;
  text_match: number;
}

interface FacetCount {
  value: string;
  count: number;
}

interface FacetResult {
  field_name: string;
  counts: FacetCount[];
}

function buildFilterBy(params: URLSearchParams): string {
  const filters: string[] = ["is_active:true"];

  const type = params.get("type");
  if (type) {
    filters.push(`type:=${type}`);
  }

  const body = params.get("body");
  if (body) {
    filters.push(`body:=${body}`);
  }

  const region = params.get("region");
  if (region) {
    filters.push(`region:=${region}`);
  }

  const country = params.get("country");
  if (country) {
    filters.push(`country:=${country}`);
  }

  const grape = params.get("grape");
  if (grape) {
    filters.push(`grape:=${grape}`);
  }

  const vintage = params.get("vintage");
  if (vintage) {
    const parsed = parseInt(vintage, 10);
    if (!isNaN(parsed)) {
      filters.push(`vintage:=${parsed}`);
    }
  }

  const minPrice = params.get("min_price");
  if (minPrice) {
    const parsed = parseInt(minPrice, 10);
    if (!isNaN(parsed)) {
      filters.push(`price_cents:>=${parsed}`);
    }
  }

  const maxPrice = params.get("max_price");
  if (maxPrice) {
    const parsed = parseInt(maxPrice, 10);
    if (!isNaN(parsed)) {
      filters.push(`price_cents:<=${parsed}`);
    }
  }

  return filters.join(" && ");
}

async function searchWithTypesense(
  query: string,
  params: URLSearchParams,
): Promise<{
  results: Array<{
    id: string;
    name: string;
    slug: string;
    type: string;
    body: string;
    grape: string;
    region: string;
    country: string;
    vintage: number;
    price_cents: number;
    description: string;
    highlights: Array<{ field: string; snippet: string }>;
  }>;
  facets: Record<string, FacetCount[]>;
  found: number;
  page: number;
  total_pages: number;
}> {
  const client = getTypesenseClient();
  const page = Math.max(1, parseInt(params.get("page") ?? "1", 10));
  const limit = Math.min(
    50,
    Math.max(1, parseInt(params.get("limit") ?? "12", 10)),
  );

  const searchResult = await client
    .collections(WINES_COLLECTION)
    .documents()
    .search({
      q: query,
      query_by:
        "name,description,grape,region,tasting_notes_nose,tasting_notes_palate,food_pairing",
      facet_by: "type,body,grape,region,country",
      filter_by: buildFilterBy(params),
      sort_by: query === "*" ? "name:asc" : "_text_match:desc,name:asc",
      per_page: limit,
      page,
      typo_tokens_threshold: 3,
      num_typos: 2,
      highlight_full_fields: "name,description",
    });

  const hits = (searchResult.hits ?? []) as unknown as TypesenseHit[];

  const results = hits.map((hit) => ({
    id: hit.document.id,
    name: hit.document.name,
    slug: hit.document.slug,
    type: hit.document.type,
    body: hit.document.body,
    grape: hit.document.grape,
    region: hit.document.region,
    country: hit.document.country,
    vintage: hit.document.vintage,
    price_cents: hit.document.price_cents,
    description: hit.document.description,
    highlights: hit.highlights ?? [],
  }));

  const facets: Record<string, FacetCount[]> = {};
  const facetResults = (searchResult.facet_counts ??
    []) as unknown as FacetResult[];
  for (const facet of facetResults) {
    facets[facet.field_name] = facet.counts;
  }

  const found = (searchResult.found as number) ?? 0;

  return {
    results,
    facets,
    found,
    page,
    total_pages: Math.ceil(found / limit),
  };
}

async function fallbackToSupabase(query: string) {
  const wines = await searchWines(query);

  return {
    results: wines.map((wine) => ({
      id: wine.id,
      name: wine.name,
      slug: wine.slug,
      type: wine.type,
      body: wine.body,
      grape: null,
      region: wine.region?.name ?? null,
      country: wine.region?.country ?? null,
      vintage: wine.vintage,
      price_cents: wine.price_cents,
      description: wine.description,
      highlights: [],
    })),
    facets: {},
    found: wines.length,
    page: 1,
    total_pages: 1,
    source: "supabase" as const,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q");

  if (!query || query.trim().length < 1) {
    return NextResponse.json({
      results: [],
      facets: {},
      found: 0,
      page: 1,
      total_pages: 0,
    });
  }

  const trimmedQuery = query.trim();

  try {
    const available = await isTypesenseAvailable();

    if (!available) {
      console.warn(
        "[search/typesense] Typesense unavailable, falling back to Supabase",
      );
      const fallback = await fallbackToSupabase(trimmedQuery);
      return NextResponse.json(fallback);
    }

    const result = await searchWithTypesense(trimmedQuery, searchParams);
    return NextResponse.json({ ...result, source: "typesense" });
  } catch (err) {
    console.error("[search/typesense] Typesense search failed:", err);

    try {
      const fallback = await fallbackToSupabase(trimmedQuery);
      return NextResponse.json(fallback);
    } catch {
      return NextResponse.json(
        { results: [], facets: {}, found: 0, error: "Search failed" },
        { status: 500 },
      );
    }
  }
}
