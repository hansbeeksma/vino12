-- Migration 010: Wine Traceability
-- Lightweight blockchain: signed JSON records with hash chain

CREATE TYPE supply_chain_event_type AS ENUM (
  'harvest',
  'vinification',
  'bottling',
  'quality_check',
  'import',
  'warehouse',
  'delivery'
);

CREATE TABLE supply_chain_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wine_id UUID NOT NULL REFERENCES wines(id) ON DELETE CASCADE,
  event_type supply_chain_event_type NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  location TEXT NOT NULL,
  actor TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  previous_hash TEXT,
  hash TEXT NOT NULL,
  signature TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_supply_chain_events_wine ON supply_chain_events(wine_id);
CREATE INDEX idx_supply_chain_events_type ON supply_chain_events(event_type);
CREATE INDEX idx_supply_chain_events_timestamp ON supply_chain_events(timestamp);
CREATE INDEX idx_supply_chain_events_hash ON supply_chain_events(hash);

-- RLS policies
ALTER TABLE supply_chain_events ENABLE ROW LEVEL SECURITY;

-- Public read access (consumers can verify)
CREATE POLICY "Anyone can read supply chain events"
  ON supply_chain_events FOR SELECT
  USING (true);

-- Only service role can insert/update (via API)
CREATE POLICY "Service role can insert supply chain events"
  ON supply_chain_events FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update supply chain events"
  ON supply_chain_events FOR UPDATE
  USING (auth.role() = 'service_role');
