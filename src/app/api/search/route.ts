import { NextRequest, NextResponse } from "next/server";
import { searchWines } from "@/lib/api/wines";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q");

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const wines = await searchWines(query.trim());

    const results = wines.map((wine) => ({
      id: wine.id,
      name: wine.name,
      slug: wine.slug,
      type: wine.type,
      region: wine.region?.name ?? null,
      price_cents: wine.price_cents,
      image_url: wine.image_url,
    }));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [], error: "Search failed" });
  }
}
