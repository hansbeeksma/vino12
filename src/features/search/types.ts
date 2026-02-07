import type { Wine, WineFilters } from "../products/types";

export interface SearchResult {
  wines: Wine[];
  total: number;
  page: number;
  per_page: number;
  filters: ActiveFilters;
}

export interface ActiveFilters extends WineFilters {
  sort_by?: "price_asc" | "price_desc" | "name_asc" | "newest" | "relevance";
}

export interface SearchSuggestion {
  type: "wine" | "category" | "grape" | "region";
  label: string;
  slug: string;
}
