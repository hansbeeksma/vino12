export type SupplyChainEventType =
  | "harvest"
  | "vinification"
  | "bottling"
  | "quality_check"
  | "import"
  | "warehouse"
  | "delivery";

export interface SupplyChainEvent {
  id: string;
  wine_id: string;
  event_type: SupplyChainEventType;
  timestamp: string;
  location: string;
  actor: string;
  data: Record<string, unknown>;
  previous_hash: string | null;
  hash: string;
  signature: string;
}

export interface WinePassport {
  wine_id: string;
  wine_name: string;
  wine_slug: string;
  producer: string;
  region: string;
  vintage: number | null;
  events: SupplyChainEvent[];
  chain_valid: boolean;
  generated_at: string;
}

export interface VerificationResult {
  valid: boolean;
  wine_name: string;
  chain_intact: boolean;
  event_count: number;
  last_event: string | null;
  errors: string[];
}
