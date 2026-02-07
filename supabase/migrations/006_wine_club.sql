-- Migration 006: Wine Club
-- Subscriptions and reviews

CREATE TABLE wine_club_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL DEFAULT 'monthly',
  bottles_per_shipment INTEGER NOT NULL DEFAULT 6,
  price_cents INTEGER NOT NULL,
  mollie_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  preferences JSONB DEFAULT '{}',
  next_shipment_date DATE,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE wine_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wine_id UUID REFERENCES wines(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT,
  is_verified_purchase BOOLEAN NOT NULL DEFAULT false,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (wine_id, customer_id)
);

-- Indexes
CREATE INDEX idx_subscriptions_customer ON wine_club_subscriptions(customer_id);
CREATE INDEX idx_subscriptions_status ON wine_club_subscriptions(status);
CREATE INDEX idx_reviews_wine ON wine_reviews(wine_id);
CREATE INDEX idx_reviews_customer ON wine_reviews(customer_id);
CREATE INDEX idx_reviews_approved ON wine_reviews(is_approved) WHERE is_approved = true;

-- Triggers
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON wine_club_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON wine_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();
