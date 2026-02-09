-- Migration: Conversion Funnel Tracking
-- Created: 2026-02-09
-- Issue: VINO-169
-- Description: Tables, views, and functions for conversion funnel analytics

-- ===================
-- 1. FUNNEL EVENTS TABLE
-- ===================

CREATE TABLE IF NOT EXISTS funnel_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'page_visit',
    'product_viewed',
    'add_to_cart',
    'checkout_started',
    'order_completed'
  )),
  event_data JSONB DEFAULT '{}',
  device_type TEXT CHECK (device_type IN ('mobile', 'desktop', 'tablet')),
  browser TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_funnel_events_session ON funnel_events(session_id, created_at);
CREATE INDEX idx_funnel_events_type ON funnel_events(event_type, created_at);
CREATE INDEX idx_funnel_events_device ON funnel_events(device_type, created_at);
CREATE INDEX idx_funnel_events_created ON funnel_events(created_at);
CREATE INDEX idx_funnel_events_user ON funnel_events(user_id, created_at) WHERE user_id IS NOT NULL;

COMMENT ON TABLE funnel_events IS 'Track user journey through conversion funnel';

-- ===================
-- 2. FUNNEL OVERVIEW VIEW
-- ===================

CREATE OR REPLACE VIEW funnel_overview AS
WITH funnel_stages AS (
  SELECT
    DATE(created_at) as date,
    COUNT(DISTINCT CASE WHEN event_type = 'page_visit' THEN session_id END) as visits,
    COUNT(DISTINCT CASE WHEN event_type = 'product_viewed' THEN session_id END) as product_views,
    COUNT(DISTINCT CASE WHEN event_type = 'add_to_cart' THEN session_id END) as add_to_carts,
    COUNT(DISTINCT CASE WHEN event_type = 'checkout_started' THEN session_id END) as checkouts,
    COUNT(DISTINCT CASE WHEN event_type = 'order_completed' THEN session_id END) as orders
  FROM funnel_events
  WHERE created_at >= CURRENT_DATE - 90
  GROUP BY DATE(created_at)
)
SELECT
  date,
  visits,
  product_views,
  add_to_carts,
  checkouts,
  orders,
  -- Conversion rates (stage to stage)
  ROUND(100.0 * product_views / NULLIF(visits, 0), 2) as visit_to_product_pct,
  ROUND(100.0 * add_to_carts / NULLIF(product_views, 0), 2) as product_to_cart_pct,
  ROUND(100.0 * checkouts / NULLIF(add_to_carts, 0), 2) as cart_to_checkout_pct,
  ROUND(100.0 * orders / NULLIF(checkouts, 0), 2) as checkout_to_order_pct,
  ROUND(100.0 * orders / NULLIF(visits, 0), 2) as overall_conversion_pct,
  -- Drop-off rates
  ROUND(100.0 * (visits - product_views) / NULLIF(visits, 0), 2) as visit_dropoff_pct,
  ROUND(100.0 * (product_views - add_to_carts) / NULLIF(product_views, 0), 2) as product_dropoff_pct,
  ROUND(100.0 * (add_to_carts - checkouts) / NULLIF(add_to_carts, 0), 2) as cart_dropoff_pct,
  ROUND(100.0 * (checkouts - orders) / NULLIF(checkouts, 0), 2) as checkout_dropoff_pct
FROM funnel_stages
ORDER BY date DESC;

COMMENT ON VIEW funnel_overview IS 'Daily funnel metrics with conversion and drop-off rates';

-- ===================
-- 3. DEVICE BREAKDOWN VIEW
-- ===================

CREATE OR REPLACE VIEW funnel_by_device AS
WITH funnel_by_device AS (
  SELECT
    device_type,
    COUNT(DISTINCT CASE WHEN event_type = 'page_visit' THEN session_id END) as visits,
    COUNT(DISTINCT CASE WHEN event_type = 'product_viewed' THEN session_id END) as product_views,
    COUNT(DISTINCT CASE WHEN event_type = 'add_to_cart' THEN session_id END) as add_to_carts,
    COUNT(DISTINCT CASE WHEN event_type = 'checkout_started' THEN session_id END) as checkouts,
    COUNT(DISTINCT CASE WHEN event_type = 'order_completed' THEN session_id END) as orders
  FROM funnel_events
  WHERE created_at >= CURRENT_DATE - 30
    AND device_type IS NOT NULL
  GROUP BY device_type
)
SELECT
  device_type,
  visits,
  product_views,
  add_to_carts,
  checkouts,
  orders,
  ROUND(100.0 * orders / NULLIF(visits, 0), 2) as conversion_rate_pct,
  ROUND(100.0 * product_views / NULLIF(visits, 0), 2) as visit_to_product_pct,
  ROUND(100.0 * orders / NULLIF(checkouts, 0), 2) as checkout_completion_pct
FROM funnel_by_device
ORDER BY visits DESC;

COMMENT ON VIEW funnel_by_device IS 'Funnel metrics breakdown by device type (30 days)';

-- ===================
-- 4. BROWSER BREAKDOWN VIEW
-- ===================

CREATE OR REPLACE VIEW funnel_by_browser AS
WITH funnel_by_browser AS (
  SELECT
    browser,
    COUNT(DISTINCT CASE WHEN event_type = 'page_visit' THEN session_id END) as visits,
    COUNT(DISTINCT CASE WHEN event_type = 'product_viewed' THEN session_id END) as product_views,
    COUNT(DISTINCT CASE WHEN event_type = 'order_completed' THEN session_id END) as orders
  FROM funnel_events
  WHERE created_at >= CURRENT_DATE - 30
    AND browser IS NOT NULL
  GROUP BY browser
)
SELECT
  browser,
  visits,
  product_views,
  orders,
  ROUND(100.0 * orders / NULLIF(visits, 0), 2) as conversion_rate_pct,
  ROUND(100.0 * product_views / NULLIF(visits, 0), 2) as engagement_rate_pct
FROM funnel_by_browser
ORDER BY visits DESC;

COMMENT ON VIEW funnel_by_browser IS 'Funnel metrics breakdown by browser (30 days)';

-- ===================
-- 5. FUNNEL SANKEY DATA (for visualization)
-- ===================

CREATE OR REPLACE VIEW funnel_sankey AS
WITH stage_counts AS (
  SELECT
    SUM(visits) as visits,
    SUM(product_views) as product_views,
    SUM(add_to_carts) as add_to_carts,
    SUM(checkouts) as checkouts,
    SUM(orders) as orders
  FROM funnel_overview
  WHERE date >= CURRENT_DATE - 30
)
SELECT 'Visit' as source, 'Product View' as target, product_views as value FROM stage_counts
UNION ALL
SELECT 'Product View' as source, 'Add to Cart' as target, add_to_carts as value FROM stage_counts
UNION ALL
SELECT 'Add to Cart' as source, 'Checkout' as target, checkouts as value FROM stage_counts
UNION ALL
SELECT 'Checkout' as source, 'Paid' as target, orders as value FROM stage_counts;

COMMENT ON VIEW funnel_sankey IS 'Sankey diagram data for funnel visualization (30 days)';

-- ===================
-- 6. DROP-OFF ANALYSIS VIEW
-- ===================

CREATE OR REPLACE VIEW funnel_dropoffs AS
WITH stage_counts AS (
  SELECT
    SUM(visits) as visits,
    SUM(product_views) as product_views,
    SUM(add_to_carts) as add_to_carts,
    SUM(checkouts) as checkouts,
    SUM(orders) as orders
  FROM funnel_overview
  WHERE date >= CURRENT_DATE - 30
)
SELECT
  'Visit → Product' as step,
  1 as step_order,
  ROUND(AVG(visit_dropoff_pct), 1) as drop_off_rate,
  SUM(visits - product_views) as lost_users,
  SUM(visits) as stage_users
FROM funnel_overview, stage_counts
WHERE date >= CURRENT_DATE - 30
UNION ALL
SELECT
  'Product → Cart' as step,
  2 as step_order,
  ROUND(AVG(product_dropoff_pct), 1) as drop_off_rate,
  SUM(product_views - add_to_carts) as lost_users,
  SUM(product_views) as stage_users
FROM funnel_overview, stage_counts
WHERE date >= CURRENT_DATE - 30
UNION ALL
SELECT
  'Cart → Checkout' as step,
  3 as step_order,
  ROUND(AVG(cart_dropoff_pct), 1) as drop_off_rate,
  SUM(add_to_carts - checkouts) as lost_users,
  SUM(add_to_carts) as stage_users
FROM funnel_overview, stage_counts
WHERE date >= CURRENT_DATE - 30
UNION ALL
SELECT
  'Checkout → Paid' as step,
  4 as step_order,
  ROUND(AVG(checkout_dropoff_pct), 1) as drop_off_rate,
  SUM(checkouts - orders) as lost_users,
  SUM(checkouts) as stage_users
FROM funnel_overview, stage_counts
WHERE date >= CURRENT_DATE - 30
ORDER BY step_order;

COMMENT ON VIEW funnel_dropoffs IS 'Drop-off analysis by funnel stage (30 days)';

-- ===================
-- 7. TIME PERIOD COMPARISON FUNCTION
-- ===================

CREATE OR REPLACE FUNCTION get_funnel_comparison(
  period_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  period TEXT,
  visits BIGINT,
  product_views BIGINT,
  add_to_carts BIGINT,
  checkouts BIGINT,
  orders BIGINT,
  conversion_rate NUMERIC,
  change_pct NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH current_period AS (
    SELECT
      COUNT(DISTINCT CASE WHEN event_type = 'page_visit' THEN session_id END) as visits,
      COUNT(DISTINCT CASE WHEN event_type = 'product_viewed' THEN session_id END) as product_views,
      COUNT(DISTINCT CASE WHEN event_type = 'add_to_cart' THEN session_id END) as add_to_carts,
      COUNT(DISTINCT CASE WHEN event_type = 'checkout_started' THEN session_id END) as checkouts,
      COUNT(DISTINCT CASE WHEN event_type = 'order_completed' THEN session_id END) as orders
    FROM funnel_events
    WHERE created_at >= CURRENT_DATE - period_days
  ),
  previous_period AS (
    SELECT
      COUNT(DISTINCT CASE WHEN event_type = 'page_visit' THEN session_id END) as visits,
      COUNT(DISTINCT CASE WHEN event_type = 'product_viewed' THEN session_id END) as product_views,
      COUNT(DISTINCT CASE WHEN event_type = 'add_to_cart' THEN session_id END) as add_to_carts,
      COUNT(DISTINCT CASE WHEN event_type = 'checkout_started' THEN session_id END) as checkouts,
      COUNT(DISTINCT CASE WHEN event_type = 'order_completed' THEN session_id END) as orders
    FROM funnel_events
    WHERE created_at >= CURRENT_DATE - (period_days * 2)
      AND created_at < CURRENT_DATE - period_days
  )
  SELECT
    'Current' as period,
    cp.visits,
    cp.product_views,
    cp.add_to_carts,
    cp.checkouts,
    cp.orders,
    ROUND(100.0 * cp.orders / NULLIF(cp.visits, 0), 2) as conversion_rate,
    ROUND(100.0 * (cp.orders::numeric - pp.orders) / NULLIF(pp.orders, 0), 2) as change_pct
  FROM current_period cp, previous_period pp
  UNION ALL
  SELECT
    'Previous' as period,
    pp.visits,
    pp.product_views,
    pp.add_to_carts,
    pp.checkouts,
    pp.orders,
    ROUND(100.0 * pp.orders / NULLIF(pp.visits, 0), 2) as conversion_rate,
    0.0 as change_pct
  FROM previous_period pp;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_funnel_comparison IS 'Compare funnel metrics between current and previous period';

-- ===================
-- 8. SESSION JOURNEY VIEW
-- ===================

CREATE OR REPLACE VIEW session_journeys AS
WITH session_events AS (
  SELECT
    session_id,
    user_id,
    device_type,
    browser,
    array_agg(event_type ORDER BY created_at) as event_sequence,
    MIN(created_at) as session_start,
    MAX(created_at) as session_end,
    EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) as session_duration_seconds,
    COUNT(*) as event_count,
    BOOL_OR(event_type = 'order_completed') as converted
  FROM funnel_events
  WHERE created_at >= CURRENT_DATE - 7
  GROUP BY session_id, user_id, device_type, browser
)
SELECT
  session_id,
  user_id,
  device_type,
  browser,
  event_sequence,
  event_count,
  ROUND(session_duration_seconds / 60, 1) as duration_minutes,
  converted,
  session_start,
  session_end
FROM session_events
ORDER BY session_start DESC;

COMMENT ON VIEW session_journeys IS 'Individual session journeys with event sequences (7 days)';

-- ===================
-- 9. RLS POLICIES
-- ===================

ALTER TABLE funnel_events ENABLE ROW LEVEL SECURITY;

-- Service role can read/write (for API route)
CREATE POLICY "Service role full access"
  ON funnel_events FOR ALL
  USING (true)
  WITH CHECK (true);

-- Authenticated users can read their own events
CREATE POLICY "Users can view own events"
  ON funnel_events FOR SELECT
  USING (auth.uid() = user_id);

-- Anonymous sessions can be inserted (but not read)
CREATE POLICY "Anonymous events insertable"
  ON funnel_events FOR INSERT
  WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

-- ===================
-- 10. GRANTS
-- ===================

GRANT SELECT ON funnel_overview TO authenticated, service_role;
GRANT SELECT ON funnel_by_device TO authenticated, service_role;
GRANT SELECT ON funnel_by_browser TO authenticated, service_role;
GRANT SELECT ON funnel_sankey TO authenticated, service_role;
GRANT SELECT ON funnel_dropoffs TO authenticated, service_role;
GRANT SELECT ON session_journeys TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_funnel_comparison TO authenticated, service_role;

-- Service role needs insert/select on events table (for API route)
GRANT INSERT, SELECT ON funnel_events TO service_role;

-- ===================
-- 11. UPDATED_AT TRIGGER
-- ===================

CREATE OR REPLACE FUNCTION update_funnel_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_funnel_events_timestamp
  BEFORE UPDATE ON funnel_events
  FOR EACH ROW
  EXECUTE FUNCTION update_funnel_events_updated_at();
