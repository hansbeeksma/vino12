-- Analytics infrastructure for data-driven product development
-- Append-only event tracking, daily rollups, and cohort analysis

-- =============================================================================
-- Event tracking (append-only)
-- =============================================================================
CREATE TABLE analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  session_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE analytics_events IS 'Append-only event log for analytics. Server-side tracked, consent-aware.';

-- Indexes for common query patterns
CREATE INDEX idx_events_name_date ON analytics_events(event_name, created_at);
CREATE INDEX idx_events_session ON analytics_events(session_id);
CREATE INDEX idx_events_user ON analytics_events(user_id);
CREATE INDEX idx_events_created ON analytics_events(created_at);

-- =============================================================================
-- Daily rollups (materialized via cron)
-- =============================================================================
CREATE TABLE analytics_daily_metrics (
  date DATE NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL DEFAULT 0,
  dimensions JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (date, metric_name)
);

COMMENT ON TABLE analytics_daily_metrics IS 'Pre-calculated daily metrics. Populated by calculate_daily_metrics().';

-- =============================================================================
-- Cohort tracking
-- =============================================================================
CREATE TABLE analytics_cohorts (
  cohort_month DATE NOT NULL,
  user_id UUID NOT NULL,
  first_purchase_at TIMESTAMPTZ,
  last_purchase_at TIMESTAMPTZ,
  total_orders INTEGER DEFAULT 0,
  total_revenue NUMERIC DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (cohort_month, user_id)
);

COMMENT ON TABLE analytics_cohorts IS 'Monthly cohort data for retention analysis.';

CREATE INDEX idx_cohorts_user ON analytics_cohorts(user_id);

-- =============================================================================
-- RLS Policies
-- =============================================================================
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_cohorts ENABLE ROW LEVEL SECURITY;

-- Service role has full access (for server-side tracking and cron jobs)
CREATE POLICY "Service role full access on events"
  ON analytics_events FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on metrics"
  ON analytics_daily_metrics FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access on cohorts"
  ON analytics_cohorts FOR ALL
  USING (auth.role() = 'service_role');

-- =============================================================================
-- Daily rollup function
-- =============================================================================
CREATE OR REPLACE FUNCTION calculate_daily_metrics(target_date DATE DEFAULT CURRENT_DATE - 1)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Page views
  INSERT INTO analytics_daily_metrics (date, metric_name, metric_value)
  VALUES (
    target_date,
    'page_views',
    (SELECT COUNT(*) FROM analytics_events
     WHERE event_name = 'page_viewed' AND created_at::date = target_date)
  )
  ON CONFLICT (date, metric_name)
  DO UPDATE SET metric_value = EXCLUDED.metric_value, updated_at = now();

  -- Unique visitors (by session)
  INSERT INTO analytics_daily_metrics (date, metric_name, metric_value)
  VALUES (
    target_date,
    'unique_visitors',
    (SELECT COUNT(DISTINCT session_id) FROM analytics_events
     WHERE created_at::date = target_date AND session_id IS NOT NULL)
  )
  ON CONFLICT (date, metric_name)
  DO UPDATE SET metric_value = EXCLUDED.metric_value, updated_at = now();

  -- Products viewed
  INSERT INTO analytics_daily_metrics (date, metric_name, metric_value)
  VALUES (
    target_date,
    'products_viewed',
    (SELECT COUNT(*) FROM analytics_events
     WHERE event_name = 'product_viewed' AND created_at::date = target_date)
  )
  ON CONFLICT (date, metric_name)
  DO UPDATE SET metric_value = EXCLUDED.metric_value, updated_at = now();

  -- Add to cart events
  INSERT INTO analytics_daily_metrics (date, metric_name, metric_value)
  VALUES (
    target_date,
    'add_to_cart',
    (SELECT COUNT(*) FROM analytics_events
     WHERE event_name = 'added_to_cart' AND created_at::date = target_date)
  )
  ON CONFLICT (date, metric_name)
  DO UPDATE SET metric_value = EXCLUDED.metric_value, updated_at = now();

  -- Checkouts started
  INSERT INTO analytics_daily_metrics (date, metric_name, metric_value)
  VALUES (
    target_date,
    'checkouts_started',
    (SELECT COUNT(*) FROM analytics_events
     WHERE event_name = 'checkout_started' AND created_at::date = target_date)
  )
  ON CONFLICT (date, metric_name)
  DO UPDATE SET metric_value = EXCLUDED.metric_value, updated_at = now();

  -- Orders completed
  INSERT INTO analytics_daily_metrics (date, metric_name, metric_value)
  VALUES (
    target_date,
    'orders',
    (SELECT COUNT(*) FROM analytics_events
     WHERE event_name = 'checkout_completed' AND created_at::date = target_date)
  )
  ON CONFLICT (date, metric_name)
  DO UPDATE SET metric_value = EXCLUDED.metric_value, updated_at = now();

  -- Revenue (sum of totalCents from checkout_completed events)
  INSERT INTO analytics_daily_metrics (date, metric_name, metric_value)
  VALUES (
    target_date,
    'revenue_cents',
    (SELECT COALESCE(SUM((properties->>'totalCents')::numeric), 0)
     FROM analytics_events
     WHERE event_name = 'checkout_completed' AND created_at::date = target_date)
  )
  ON CONFLICT (date, metric_name)
  DO UPDATE SET metric_value = EXCLUDED.metric_value, updated_at = now();

  -- Searches
  INSERT INTO analytics_daily_metrics (date, metric_name, metric_value)
  VALUES (
    target_date,
    'searches',
    (SELECT COUNT(*) FROM analytics_events
     WHERE event_name = 'product_searched' AND created_at::date = target_date)
  )
  ON CONFLICT (date, metric_name)
  DO UPDATE SET metric_value = EXCLUDED.metric_value, updated_at = now();
END;
$$;

COMMENT ON FUNCTION calculate_daily_metrics IS 'Calculate daily analytics rollups. Call via Vercel Cron daily.';

-- =============================================================================
-- Cohort update function
-- =============================================================================
CREATE OR REPLACE FUNCTION update_cohorts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO analytics_cohorts (cohort_month, user_id, first_purchase_at, last_purchase_at, total_orders, total_revenue)
  SELECT
    date_trunc('month', MIN(e.created_at))::date AS cohort_month,
    e.user_id,
    MIN(e.created_at) AS first_purchase_at,
    MAX(e.created_at) AS last_purchase_at,
    COUNT(*) AS total_orders,
    COALESCE(SUM((e.properties->>'totalCents')::numeric), 0) AS total_revenue
  FROM analytics_events e
  WHERE e.event_name = 'checkout_completed'
    AND e.user_id IS NOT NULL
  GROUP BY e.user_id
  ON CONFLICT (cohort_month, user_id)
  DO UPDATE SET
    last_purchase_at = EXCLUDED.last_purchase_at,
    total_orders = EXCLUDED.total_orders,
    total_revenue = EXCLUDED.total_revenue,
    updated_at = now();
END;
$$;

COMMENT ON FUNCTION update_cohorts IS 'Update cohort tracking table. Call via Vercel Cron weekly.';
