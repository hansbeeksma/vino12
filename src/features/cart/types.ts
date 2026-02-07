export interface CartItem {
  wine_id: string;
  name: string;
  slug: string;
  vintage: number | null;
  price_cents: number;
  quantity: number;
  image_url: string | null;
  volume_ml: number;
  max_quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  item_count: number;
}
