export interface WineClubSubscription {
  id: string;
  customer_id: string;
  plan_type: "monthly" | "bimonthly" | "quarterly";
  bottles_per_shipment: number;
  price_cents: number;
  mollie_subscription_id: string | null;
  status: "active" | "paused" | "cancelled";
  preferences: WinePreferences;
  next_shipment_date: string | null;
}

export interface WinePreferences {
  preferred_types?: string[];
  preferred_regions?: string[];
  budget_range?: { min: number; max: number };
  exclude_grapes?: string[];
}

export interface WineReview {
  id: string;
  wine_id: string;
  customer_id: string;
  rating: number;
  title: string | null;
  body: string | null;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
}
