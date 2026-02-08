-- Migration 011: Gamification & Social Proof
-- Points, badges, leaderboards, real-time activity

-- Badge definitions
CREATE TABLE badge_definitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'star',
  category TEXT NOT NULL DEFAULT 'general',
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL DEFAULT 1,
  points_reward INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Customer badges (earned)
CREATE TABLE customer_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badge_definitions(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (customer_id, badge_id)
);

-- Customer points ledger
CREATE TABLE customer_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reference_type TEXT,
  reference_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Wine activity (real-time social proof)
CREATE TABLE wine_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wine_id UUID NOT NULL REFERENCES wines(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_customer_badges_customer ON customer_badges(customer_id);
CREATE INDEX idx_customer_badges_badge ON customer_badges(badge_id);
CREATE INDEX idx_customer_points_customer ON customer_points(customer_id);
CREATE INDEX idx_customer_points_created ON customer_points(created_at);
CREATE INDEX idx_wine_activity_wine ON wine_activity(wine_id);
CREATE INDEX idx_wine_activity_created ON wine_activity(created_at);
-- Clean up old activity (only keep last 24h for social proof)
CREATE INDEX idx_wine_activity_recent ON wine_activity(wine_id, created_at)
  WHERE created_at > NOW() - INTERVAL '24 hours';

-- RLS
ALTER TABLE badge_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE wine_activity ENABLE ROW LEVEL SECURITY;

-- Badge definitions: public read
CREATE POLICY "Anyone can read badge definitions"
  ON badge_definitions FOR SELECT USING (true);

-- Customer badges: owner can read own, public aggregate
CREATE POLICY "Users can read own badges"
  ON customer_badges FOR SELECT
  USING (customer_id IN (
    SELECT id FROM customers WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Service role manages badges"
  ON customer_badges FOR ALL
  USING (auth.role() = 'service_role');

-- Points: owner reads own
CREATE POLICY "Users can read own points"
  ON customer_points FOR SELECT
  USING (customer_id IN (
    SELECT id FROM customers WHERE auth_user_id = auth.uid()
  ));

CREATE POLICY "Service role manages points"
  ON customer_points FOR ALL
  USING (auth.role() = 'service_role');

-- Activity: public read (for social proof), service role write
CREATE POLICY "Anyone can read activity"
  ON wine_activity FOR SELECT USING (true);

CREATE POLICY "Service role manages activity"
  ON wine_activity FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Seed badge definitions
INSERT INTO badge_definitions (slug, name, description, icon, category, requirement_type, requirement_value, points_reward) VALUES
  ('eerste-bestelling', 'Eerste Bestelling', 'Plaats je eerste bestelling bij VINO12', 'shopping-bag', 'orders', 'order_count', 1, 50),
  ('rode-wijn-expert', 'Rode Wijn Expert', 'Koop 5 verschillende rode wijnen', 'wine', 'exploration', 'red_wine_count', 5, 100),
  ('witte-wijn-kenner', 'Witte Wijn Kenner', 'Koop 5 verschillende witte wijnen', 'wine', 'exploration', 'white_wine_count', 5, 100),
  ('recensent', 'Recensent', 'Schrijf je eerste review', 'star', 'engagement', 'review_count', 1, 25),
  ('sommelier', 'Sommelier', 'Schrijf 10 reviews', 'award', 'engagement', 'review_count', 10, 200),
  ('ontdekker', 'Ontdekker', 'Probeer wijnen uit 3 verschillende regio''s', 'map', 'exploration', 'region_count', 3, 75),
  ('trouwe-klant', 'Trouwe Klant', 'Plaats 5 bestellingen', 'heart', 'orders', 'order_count', 5, 150),
  ('body-verkenner', 'Body Verkenner', 'Probeer alle 5 body types (licht tot vol)', 'compass', 'exploration', 'body_type_count', 5, 150);

-- View: customer total points
CREATE VIEW customer_total_points AS
SELECT
  customer_id,
  COALESCE(SUM(points), 0) AS total_points,
  COUNT(*) AS transaction_count
FROM customer_points
GROUP BY customer_id;

-- View: leaderboard (top sommeliers)
CREATE VIEW leaderboard AS
SELECT
  c.id AS customer_id,
  c.first_name,
  COALESCE(SUM(cp.points), 0) AS total_points,
  COUNT(DISTINCT cb.badge_id) AS badge_count,
  COUNT(DISTINCT wr.id) AS review_count
FROM customers c
LEFT JOIN customer_points cp ON cp.customer_id = c.id
LEFT JOIN customer_badges cb ON cb.customer_id = c.id
LEFT JOIN wine_reviews wr ON wr.customer_id = c.id AND wr.is_approved = true
GROUP BY c.id, c.first_name
HAVING COALESCE(SUM(cp.points), 0) > 0
ORDER BY total_points DESC;
