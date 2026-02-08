import { createServiceRoleClient } from "@/lib/supabase/server";
import type { WineType, WineBody } from "@/lib/schemas/wine";

export interface WineRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: WineType;
  body: WineBody | null;
  region_id: string | null;
  vintage: number | null;
  alcohol_percentage: number | null;
  price_cents: number;
  compare_at_price_cents: number | null;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  tasting_notes: string | null;
  food_pairing: string | null;
  stock_quantity: number;
  volume_ml: number;
  created_at: string;
  updated_at: string;
  region: { id: string; name: string; country: string } | null;
}

export async function getWines(filters?: {
  type?: WineType;
  body?: WineBody;
  featured?: boolean;
}): Promise<WineRow[]> {
  try {
    const supabase = createServiceRoleClient();

    let query = supabase
      .from("wines")
      .select("*, region:regions(id, name, country)")
      .eq("is_active", true)
      .order("name");

    if (filters?.type) {
      query = query.eq("type", filters.type);
    }
    if (filters?.body) {
      query = query.eq("body", filters.body);
    }
    if (filters?.featured) {
      query = query.eq("is_featured", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Failed to fetch wines: ${error.message}`);
      return [];
    }

    return (data ?? []) as WineRow[];
  } catch (err) {
    console.error("Wine fetch error:", err);
    return [];
  }
}

export async function getWineBySlug(slug: string): Promise<WineRow | null> {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("wines")
      .select("*, region:regions(id, name, country)")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      console.error(`Failed to fetch wine: ${error.message}`);
      return null;
    }

    return data as WineRow;
  } catch (err) {
    console.error("Wine slug fetch error:", err);
    return null;
  }
}

export async function getWineSlugs(): Promise<{ slug: string }[]> {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("wines")
      .select("slug")
      .eq("is_active", true);

    if (error) {
      console.error(`Failed to fetch wine slugs: ${error.message}`);
      return [];
    }

    return data ?? [];
  } catch (err) {
    console.error("Wine slugs fetch error:", err);
    return [];
  }
}

export async function getWineGrapes(
  wineId: string,
): Promise<{ id: string; name: string; percentage: number | null }[]> {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("wine_grapes")
      .select("percentage, grape:grapes(id, name)")
      .eq("wine_id", wineId);

    if (error) {
      console.error(`Failed to fetch grapes: ${error.message}`);
      return [];
    }

    return (data ?? []).map((row) => {
      const grape = row.grape as unknown as { id: string; name: string };
      return {
        id: grape.id,
        name: grape.name,
        percentage: row.percentage,
      };
    });
  } catch (err) {
    console.error("Wine grapes fetch error:", err);
    return [];
  }
}

export async function searchWines(query: string): Promise<WineRow[]> {
  try {
    const supabase = createServiceRoleClient();

    const { data, error } = await supabase
      .from("wines")
      .select("*, region:regions(id, name, country)")
      .eq("is_active", true)
      .textSearch("search_vector", query, {
        config: "dutch",
        type: "websearch",
      })
      .limit(20);

    if (error) {
      console.error(`Search failed: ${error.message}`);
      return [];
    }

    return (data ?? []) as WineRow[];
  } catch (err) {
    console.error("Wine search error:", err);
    return [];
  }
}
