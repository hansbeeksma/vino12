import { type NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(
    50,
    Math.max(1, Number(searchParams.get("limit") ?? 12)),
  );
  const offset = (page - 1) * limit;

  const type = searchParams.get("type");
  const body = searchParams.get("body");
  const regionId = searchParams.get("region_id");
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  const featured = searchParams.get("featured");
  const search = searchParams.get("q");
  const sortBy = searchParams.get("sort") ?? "name_asc";

  const supabase = createServiceRoleClient();

  let query = supabase
    .from("wines")
    .select("*, region:regions(id, name, country)", { count: "exact" })
    .eq("is_active", true);

  if (type) {
    query = query.eq("type", type);
  }
  if (body) {
    query = query.eq("body", body);
  }
  if (regionId) {
    query = query.eq("region_id", regionId);
  }
  if (minPrice) {
    query = query.gte("price_cents", Number(minPrice));
  }
  if (maxPrice) {
    query = query.lte("price_cents", Number(maxPrice));
  }
  if (featured === "true") {
    query = query.eq("is_featured", true);
  }
  if (search) {
    query = query.textSearch("search_vector", search, {
      config: "dutch",
      type: "websearch",
    });
  }

  switch (sortBy) {
    case "price_asc":
      query = query.order("price_cents", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price_cents", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "name_desc":
      query = query.order("name", { ascending: false });
      break;
    default:
      query = query.order("name", { ascending: true });
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    data: data ?? [],
    meta: {
      total: count ?? 0,
      page,
      limit,
      total_pages: Math.ceil((count ?? 0) / limit),
    },
  });
}
