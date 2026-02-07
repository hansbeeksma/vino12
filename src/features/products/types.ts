export type WineType =
  | "red"
  | "white"
  | "rose"
  | "sparkling"
  | "dessert"
  | "fortified"
  | "orange";
export type WineBody =
  | "light"
  | "medium_light"
  | "medium"
  | "medium_full"
  | "full";

export interface Wine {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: WineType;
  body: WineBody | null;
  producer: Producer | null;
  region: Region | null;
  vintage: number | null;
  alcohol_percentage: number | null;
  price_cents: number;
  compare_at_price_cents: number | null;
  sku: string | null;
  image_url: string | null;
  thumbnail_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  tasting_notes: string | null;
  food_pairing: string | null;
  serving_temperature: string | null;
  stock_quantity: number;
  volume_ml: number;
  grapes: Grape[];
  categories: Category[];
}

export interface Region {
  id: string;
  name: string;
  country: string;
  description: string | null;
}

export interface Producer {
  id: string;
  name: string;
  region_id: string | null;
  description: string | null;
  website: string | null;
}

export interface Grape {
  id: string;
  name: string;
  description: string | null;
  percentage?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
}

export interface WineFilters {
  type?: WineType;
  body?: WineBody;
  region_id?: string;
  grape_id?: string;
  category_slug?: string;
  min_price_cents?: number;
  max_price_cents?: number;
  min_vintage?: number;
  max_vintage?: number;
  is_featured?: boolean;
  search?: string;
}
