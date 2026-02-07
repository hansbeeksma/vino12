export interface Supplier {
  id: string;
  name: string;
  code: string;
  api_endpoint: string | null;
  contact_email: string | null;
  is_active: boolean;
  lead_time_days: number;
  minimum_order_cents: number;
  shipping_cost_cents: number;
}

export interface InventoryItem {
  id: string;
  wine_id: string;
  supplier_id: string;
  supplier_sku: string | null;
  quantity_available: number;
  price_cents: number;
  is_primary: boolean;
  last_synced_at: string | null;
}

export interface FulfillmentOrder {
  order_id: string;
  supplier_id: string;
  items: FulfillmentOrderItem[];
  shipping_address: ShippingAddress;
  status: "pending" | "sent" | "accepted" | "shipped" | "delivered" | "failed";
}

export interface FulfillmentOrderItem {
  wine_id: string;
  supplier_sku: string;
  quantity: number;
  unit_price_cents: number;
}

export interface ShippingAddress {
  street: string;
  house_number: string;
  house_number_addition?: string;
  postal_code: string;
  city: string;
  country: string;
}
