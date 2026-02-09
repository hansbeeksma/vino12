-- Migration: AARRR Metrics Framework
-- Created: 2026-02-09
-- Issue: VINO-168
-- Description: Views and functions for AARRR (Acquisition, Activation, Retention, Revenue, Referral) metrics

-- ===================
-- 1. ACQUISITION
-- ===================

-- View: Daily acquisition metrics
CREATE OR REPLACE VIEW acquisition_metrics AS
SELECT
  DATE(created_at) as date,
  COUNT(DISTINCT id) as daily_signups,
  COUNT(*) as total_events
FROM auth.users
WHERE created_at >= CURRENT_DATE - 90
GROUP BY DATE(created_at)
ORDER BY date DESC;

COMMENT ON VIEW acquisition_metrics IS 'Daily user acquisition (signups) for last 90 days';

-- ===================
-- 2. ACTIVATION
-- ===================

-- View: Activation rate (first purchase within 7 days)
CREATE OR REPLACE VIEW activation_metrics AS
SELECT
  DATE_TRUNC('month', u.created_at)::date as cohort_month,
  COUNT(DISTINCT u.id) as signups,
  COUNT(DISTINCT CASE
    WHEN o.created_at <= u.created_at + INTERVAL '7 days' THEN o.user_id
  END) as activated_users,
  ROUND(100.0 * COUNT(DISTINCT CASE
    WHEN o.created_at <= u.created_at + INTERVAL '7 days' THEN o.user_id
  END) / NULLIF(COUNT(DISTINCT u.id), 0), 2) as activation_rate_pct,
  ROUND(AVG(EXTRACT(EPOCH FROM (o.created_at - u.created_at)) / 86400), 1) as avg_days_to_first_order
FROM auth.users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= CURRENT_DATE - 180
GROUP BY DATE_TRUNC('month', u.created_at)
ORDER BY cohort_month DESC;

COMMENT ON VIEW activation_metrics IS 'Activation rate - % users making first purchase within 7 days, by cohort month';

-- ===================
-- 3. RETENTION
-- ===================

-- View: Repeat purchase rate and retention metrics
CREATE OR REPLACE VIEW retention_metrics AS
WITH user_orders AS (
  SELECT
    user_id,
    COUNT(*) as order_count,
    MIN(created_at) as first_order_at,
    MAX(created_at) as last_order_at,
    EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) / 86400 as days_active
  FROM orders
  WHERE created_at >= CURRENT_DATE - 365
  GROUP BY user_id
)
SELECT
  DATE_TRUNC('month', first_order_at)::date as cohort_month,
  COUNT(DISTINCT user_id) as total_customers,
  COUNT(DISTINCT CASE WHEN order_count >= 2 THEN user_id END) as repeat_customers,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN order_count >= 2 THEN user_id END) / NULLIF(COUNT(DISTINCT user_id), 0), 2) as repeat_rate_pct,
  ROUND(AVG(order_count), 2) as avg_orders_per_customer,
  ROUND(AVG(days_active), 1) as avg_customer_lifespan_days
FROM user_orders
GROUP BY DATE_TRUNC('month', first_order_at)
ORDER BY cohort_month DESC;

COMMENT ON VIEW retention_metrics IS 'Repeat purchase rate and customer lifespan by cohort month';

-- ===================
-- 4. REVENUE
-- ===================

-- View: Revenue metrics (MRR, AOV, LTV)
CREATE OR REPLACE VIEW revenue_metrics AS
SELECT
  DATE_TRUNC('month', created_at)::date as month,
  COUNT(*) as order_count,
  SUM(total_amount) as total_revenue,
  ROUND(AVG(total_amount), 2) as aov,
  ROUND(SUM(total_amount) / NULLIF(COUNT(DISTINCT user_id), 0), 2) as revenue_per_customer,
  COUNT(DISTINCT user_id) as unique_customers,
  -- MRR (Monthly Recurring Revenue) from subscription orders
  SUM(CASE WHEN subscription_id IS NOT NULL THEN total_amount ELSE 0 END) as mrr,
  -- One-time revenue
  SUM(CASE WHEN subscription_id IS NULL THEN total_amount ELSE 0 END) as one_time_revenue
FROM orders
WHERE created_at >= CURRENT_DATE - 180
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

COMMENT ON VIEW revenue_metrics IS 'Monthly revenue breakdown - MRR, AOV, revenue per customer';

-- Function: Calculate Customer Lifetime Value (LTV)
CREATE OR REPLACE FUNCTION calculate_ltv(
  target_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
  user_id UUID,
  total_orders INTEGER,
  total_revenue NUMERIC,
  avg_order_value NUMERIC,
  customer_lifespan_days INTEGER,
  estimated_ltv NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH user_revenue AS (
    SELECT
      o.user_id,
      COUNT(*) as total_orders,
      SUM(o.total_amount) as total_revenue,
      ROUND(AVG(o.total_amount), 2) as avg_order_value,
      EXTRACT(EPOCH FROM (MAX(o.created_at) - MIN(o.created_at))) / 86400 as customer_lifespan_days,
      -- Estimated LTV: avg_order_value * expected_annual_orders * expected_years
      -- Assuming 6 orders/year (wine club), 3 year retention
      ROUND(AVG(o.total_amount) * 6 * 3, 2) as estimated_ltv
    FROM orders o
    WHERE (target_user_id IS NULL OR o.user_id = target_user_id)
    GROUP BY o.user_id
  )
  SELECT
    ur.user_id,
    ur.total_orders::INTEGER,
    ur.total_revenue,
    ur.avg_order_value,
    ROUND(ur.customer_lifespan_days)::INTEGER,
    ur.estimated_ltv
  FROM user_revenue ur
  ORDER BY ur.total_revenue DESC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_ltv IS 'Calculate Customer Lifetime Value (LTV) for all users or specific user';

-- ===================
-- 5. REFERRAL
-- ===================

-- Table: Referrals (track who referred whom)
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'expired')),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(referred_user_id)
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id, created_at);
CREATE INDEX idx_referrals_status ON referrals(status);

COMMENT ON TABLE referrals IS 'Track user referrals for viral coefficient calculation';

-- View: Referral metrics
CREATE OR REPLACE VIEW referral_metrics AS
WITH referral_stats AS (
  SELECT
    DATE_TRUNC('month', r.created_at)::date as month,
    COUNT(DISTINCT r.referrer_id) as total_referrers,
    COUNT(DISTINCT r.referred_user_id) as total_referrals,
    COUNT(DISTINCT CASE WHEN r.status = 'completed' THEN r.referred_user_id END) as successful_referrals,
    -- Viral coefficient: successful referrals per customer
    ROUND(COUNT(DISTINCT CASE WHEN r.status = 'completed' THEN r.referred_user_id END)::numeric /
          NULLIF((SELECT COUNT(*) FROM auth.users WHERE created_at <= DATE_TRUNC('month', r.created_at) + INTERVAL '1 month'), 0), 3) as viral_coefficient
  FROM referrals r
  WHERE r.created_at >= CURRENT_DATE - 180
  GROUP BY DATE_TRUNC('month', r.created_at)
)
SELECT
  rs.month,
  rs.total_referrers,
  rs.total_referrals,
  rs.successful_referrals,
  ROUND(100.0 * rs.total_referrers / NULLIF((SELECT COUNT(*) FROM auth.users WHERE created_at < rs.month + INTERVAL '1 month'), 0), 2) as referral_rate_pct,
  rs.viral_coefficient
FROM referral_stats rs
ORDER BY rs.month DESC;

COMMENT ON VIEW referral_metrics IS 'Monthly referral metrics - viral coefficient, referral rate';

-- ===================
-- AARRR DASHBOARD VIEW
-- Combine all 5 metrics into single view for Metabase
-- ===================

CREATE OR REPLACE VIEW aarrr_dashboard AS
WITH monthly_data AS (
  SELECT
    DATE_TRUNC('month', date)::date as month
  FROM generate_series(
    CURRENT_DATE - INTERVAL '6 months',
    CURRENT_DATE,
    INTERVAL '1 month'
  ) date
)
SELECT
  md.month,
  -- Acquisition
  COALESCE(SUM(am.daily_signups), 0) as acquisition_signups,
  -- Activation
  COALESCE(MAX(acm.activation_rate_pct), 0) as activation_rate,
  -- Retention
  COALESCE(MAX(rm.repeat_rate_pct), 0) as retention_repeat_rate,
  -- Revenue
  COALESCE(MAX(revm.total_revenue), 0) as revenue_total,
  COALESCE(MAX(revm.aov), 0) as revenue_aov,
  COALESCE(MAX(revm.mrr), 0) as revenue_mrr,
  -- Referral
  COALESCE(MAX(refm.viral_coefficient), 0) as referral_viral_coefficient,
  COALESCE(MAX(refm.referral_rate_pct), 0) as referral_rate
FROM monthly_data md
LEFT JOIN acquisition_metrics am
  ON DATE_TRUNC('month', am.date) = md.month
LEFT JOIN activation_metrics acm
  ON acm.cohort_month = md.month
LEFT JOIN retention_metrics rm
  ON rm.cohort_month = md.month
LEFT JOIN revenue_metrics revm
  ON revm.month = md.month
LEFT JOIN referral_metrics refm
  ON refm.month = md.month
GROUP BY md.month
ORDER BY md.month DESC;

COMMENT ON VIEW aarrr_dashboard IS 'Unified AARRR dashboard view - all 5 metrics combined by month';

-- ===================
-- INDEXES FOR PERFORMANCE
-- ===================

-- Orders table indexes (if not already exist)
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON orders(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_created_month ON orders(DATE_TRUNC('month', created_at));

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_created_month ON auth.users(DATE_TRUNC('month', created_at));

-- Grant access to authenticated users (if RLS enabled)
GRANT SELECT ON acquisition_metrics TO authenticated;
GRANT SELECT ON activation_metrics TO authenticated;
GRANT SELECT ON retention_metrics TO authenticated;
GRANT SELECT ON revenue_metrics TO authenticated;
GRANT SELECT ON referral_metrics TO authenticated;
GRANT SELECT ON aarrr_dashboard TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_ltv TO authenticated;

-- Grant access to service role (for Metabase)
GRANT SELECT ON acquisition_metrics TO service_role;
GRANT SELECT ON activation_metrics TO service_role;
GRANT SELECT ON retention_metrics TO service_role;
GRANT SELECT ON revenue_metrics TO service_role;
GRANT SELECT ON referral_metrics TO service_role;
GRANT SELECT ON aarrr_dashboard TO service_role;
GRANT EXECUTE ON FUNCTION calculate_ltv TO service_role;

-- RLS for referrals table
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own referrals"
  ON referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id);

CREATE POLICY "Users can create referrals"
  ON referrals FOR INSERT
  WITH CHECK (auth.uid() = referrer_id);
