-- Migration 007: Row-Level Security Policies
-- Enable RLS on all tables and define access policies

-- Enable RLS
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE grapes ENABLE ROW LEVEL SECURITY;
ALTER TABLE producers ENABLE ROW LEVEL SECURITY;
ALTER TABLE wines ENABLE ROW LEVEL SECURITY;
ALTER TABLE wine_grapes ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE wine_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE age_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_sync_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE wine_club_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wine_reviews ENABLE ROW LEVEL SECURITY;

-- Public read access for catalog
CREATE POLICY "Public can read active wines" ON wines FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read regions" ON regions FOR SELECT USING (true);
CREATE POLICY "Public can read grapes" ON grapes FOR SELECT USING (true);
CREATE POLICY "Public can read producers" ON producers FOR SELECT USING (true);
CREATE POLICY "Public can read wine_grapes" ON wine_grapes FOR SELECT USING (true);
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can read wine_categories" ON wine_categories FOR SELECT USING (true);
CREATE POLICY "Public can read approved reviews" ON wine_reviews FOR SELECT USING (is_approved = true);

-- Authenticated user policies
CREATE POLICY "Users can read own customer record" ON customers
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own customer record" ON customers
  FOR UPDATE USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can read own addresses" ON addresses
  FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert own addresses" ON addresses
  FOR INSERT WITH CHECK (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update own addresses" ON addresses
  FOR UPDATE USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can delete own addresses" ON addresses
  FOR DELETE USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can read own orders" ON orders
  FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can read own order items" ON order_items
  FOR SELECT USING (order_id IN (
    SELECT id FROM orders WHERE customer_id IN (
      SELECT id FROM customers WHERE auth_user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can read own order events" ON order_events
  FOR SELECT USING (order_id IN (
    SELECT id FROM orders WHERE customer_id IN (
      SELECT id FROM customers WHERE auth_user_id = auth.uid()
    )
  ));

CREATE POLICY "Users can read own subscriptions" ON wine_club_subscriptions
  FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert own reviews" ON wine_reviews
  FOR INSERT WITH CHECK (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update own reviews" ON wine_reviews
  FOR UPDATE USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid()));

-- Service role has full access (via supabase service key)
-- No explicit policies needed; service role bypasses RLS

-- Supplier/inventory: no public access (service role only)
-- age_verifications: no public access (service role only)
-- inventory_sync_log: no public access (service role only)
