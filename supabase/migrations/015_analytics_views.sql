-- Analytics views for Metabase dashboards
-- AARRR metrics + Conversion funnel + Device breakdown

-- =============================================================================
-- AARRR Overview View
-- =============================================================================
CREATE OR REPLACE VIEW v_aarrr_daily AS
SELECT
  d.date,
  MAX(CASE WHEN d.metric_name = 'unique_visitors' THEN d.metric_value END) AS acquisition_visitors,
  MAX(CASE WHEN d.metric_name = 'page_views' THEN d.metric_value END) AS acquisition_pageviews,
  MAX(CASE WHEN d.metric_name = 'orders' THEN d.metric_value END) AS activation_orders,
  MAX(CASE WHEN d.metric_name = 'revenue_cents' THEN d.metric_value END) AS revenue_cents,
  MAX(CASE WHEN d.metric_name = 'searches' THEN d.metric_value END) AS engagement_searches,
  MAX(CASE WHEN d.metric_name = 'products_viewed' THEN d.metric_value END) AS engagement_products_viewed,
  MAX(CASE WHEN d.metric_name = 'add_to_cart' THEN d.metric_value END) AS engagement_add_to_cart,
  MAX(CASE WHEN d.metric_name = 'checkouts_started' THEN d.metric_value END) AS engagement_checkouts_started
FROM analytics_daily_metrics d
GROUP BY d.date
ORDER BY d.date DESC;

COMMENT ON VIEW v_aarrr_daily IS 'Daily AARRR metrics pivot. Use in Metabase for trend charts.';

-- =============================================================================
-- AARRR Summary (last N days)
-- =============================================================================
CREATE OR REPLACE VIEW v_aarrr_summary_30d AS
SELECT
  'Acquisition' AS metric,
  1 AS sort_order,
  COALESCE(SUM(CASE WHEN metric_name = 'unique_visitors' THEN metric_value END), 0)::bigint AS value,
  'Unieke bezoekers' AS description
FROM analytics_daily_metrics
WHERE date >= CURRENT_DATE - 30

UNION ALL

SELECT
  'Activation' AS metric,
  2 AS sort_order,
  COALESCE(SUM(CASE WHEN metric_name = 'orders' THEN metric_value END), 0)::bigint AS value,
  'Voltooide bestellingen' AS description
FROM analytics_daily_metrics
WHERE date >= CURRENT_DATE - 30

UNION ALL

SELECT
  'Retention' AS metric,
  3 AS sort_order,
  (SELECT COUNT(DISTINCT user_id)
   FROM analytics_cohorts
   WHERE total_orders > 1
     AND last_purchase_at >= CURRENT_TIMESTAMP - INTERVAL '30 days')::bigint AS value,
  'Terugkerende klanten' AS description

UNION ALL

SELECT
  'Referral' AS metric,
  4 AS sort_order,
  COUNT(*)::bigint AS value,
  'Doorverwijzingen' AS description
FROM analytics_events
WHERE event_name = 'referral_shared'
  AND created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'

UNION ALL

SELECT
  'Revenue' AS metric,
  5 AS sort_order,
  COALESCE(SUM(CASE WHEN metric_name = 'revenue_cents' THEN metric_value END), 0)::bigint AS value,
  'Omzet in centen' AS description
FROM analytics_daily_metrics
WHERE date >= CURRENT_DATE - 30

ORDER BY sort_order;

COMMENT ON VIEW v_aarrr_summary_30d IS 'AARRR summary for last 30 days. Use as Metabase number cards.';

-- =============================================================================
-- Conversion Funnel View (session-based)
-- =============================================================================
CREATE OR REPLACE FUNCTION get_conversion_funnel(
  p_since TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP - INTERVAL '30 days'
)
RETURNS TABLE (
  step_number INT,
  step_name TEXT,
  session_count BIGINT,
  conversion_rate NUMERIC,
  drop_off_rate NUMERIC
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  WITH funnel_steps AS (
    SELECT 1 AS step_number, 'Bezoek' AS step_name, 'page_viewed' AS event_name
    UNION ALL SELECT 2, 'Product bekeken', 'product_viewed'
    UNION ALL SELECT 3, 'Winkelwagen', 'added_to_cart'
    UNION ALL SELECT 4, 'Afrekenen', 'checkout_started'
    UNION ALL SELECT 5, 'Betaald', 'checkout_completed'
  ),
  step_counts AS (
    SELECT
      fs.step_number,
      fs.step_name,
      COUNT(DISTINCT e.session_id) AS session_count
    FROM funnel_steps fs
    LEFT JOIN analytics_events e
      ON e.event_name = fs.event_name
      AND e.created_at >= p_since
      AND e.session_id IS NOT NULL
    GROUP BY fs.step_number, fs.step_name
  ),
  first_step AS (
    SELECT GREATEST(session_count, 1) AS total FROM step_counts WHERE step_number = 1
  )
  SELECT
    sc.step_number,
    sc.step_name,
    sc.session_count,
    ROUND((sc.session_count::NUMERIC / fs.total) * 100, 2) AS conversion_rate,
    CASE
      WHEN sc.step_number = 1 THEN 0
      ELSE ROUND(
        ((LAG(sc.session_count) OVER (ORDER BY sc.step_number) - sc.session_count)::NUMERIC
         / GREATEST(LAG(sc.session_count) OVER (ORDER BY sc.step_number), 1)) * 100,
        2
      )
    END AS drop_off_rate
  FROM step_counts sc
  CROSS JOIN first_step fs
  ORDER BY sc.step_number;
$$;

COMMENT ON FUNCTION get_conversion_funnel IS '5-step conversion funnel with drop-off rates. Call: SELECT * FROM get_conversion_funnel()';

-- =============================================================================
-- Conversion Funnel View (default 30 days, for Metabase)
-- =============================================================================
CREATE OR REPLACE VIEW v_conversion_funnel_30d AS
SELECT * FROM get_conversion_funnel(CURRENT_TIMESTAMP - INTERVAL '30 days');

CREATE OR REPLACE VIEW v_conversion_funnel_7d AS
SELECT * FROM get_conversion_funnel(CURRENT_TIMESTAMP - INTERVAL '7 days');

CREATE OR REPLACE VIEW v_conversion_funnel_90d AS
SELECT * FROM get_conversion_funnel(CURRENT_TIMESTAMP - INTERVAL '90 days');

COMMENT ON VIEW v_conversion_funnel_30d IS 'Conversion funnel - last 30 days';
COMMENT ON VIEW v_conversion_funnel_7d IS 'Conversion funnel - last 7 days';
COMMENT ON VIEW v_conversion_funnel_90d IS 'Conversion funnel - last 90 days';

-- =============================================================================
-- Device/Browser Breakdown
-- =============================================================================
CREATE OR REPLACE VIEW v_device_breakdown AS
SELECT
  CASE
    WHEN user_agent ILIKE '%mobile%' OR user_agent ILIKE '%android%' OR user_agent ILIKE '%iphone%' THEN 'Mobile'
    WHEN user_agent ILIKE '%tablet%' OR user_agent ILIKE '%ipad%' THEN 'Tablet'
    ELSE 'Desktop'
  END AS device_type,
  COUNT(*) AS event_count,
  COUNT(DISTINCT session_id) AS unique_sessions,
  created_at::date AS date
FROM analytics_events
WHERE created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'
  AND user_agent IS NOT NULL
GROUP BY device_type, created_at::date
ORDER BY date DESC, event_count DESC;

COMMENT ON VIEW v_device_breakdown IS 'Device type breakdown per day. Use in Metabase pie/bar charts.';

-- =============================================================================
-- Revenue KPIs
-- =============================================================================
CREATE OR REPLACE VIEW v_revenue_kpis AS
SELECT
  'AOV (gem. orderwaarde)' AS kpi,
  1 AS sort_order,
  CASE
    WHEN COUNT(*) > 0
    THEN ROUND(SUM((properties->>'totalCents')::numeric) / COUNT(*))
    ELSE 0
  END AS value_cents
FROM analytics_events
WHERE event_name = 'checkout_completed'
  AND created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'

UNION ALL

SELECT
  'Totale omzet' AS kpi,
  2 AS sort_order,
  COALESCE(SUM((properties->>'totalCents')::numeric), 0)::bigint AS value_cents
FROM analytics_events
WHERE event_name = 'checkout_completed'
  AND created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'

UNION ALL

SELECT
  'Aantal orders' AS kpi,
  3 AS sort_order,
  COUNT(*)::bigint AS value_cents
FROM analytics_events
WHERE event_name = 'checkout_completed'
  AND created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'

UNION ALL

SELECT
  'Gem. items per order' AS kpi,
  4 AS sort_order,
  CASE
    WHEN COUNT(*) > 0
    THEN ROUND(AVG((properties->>'itemCount')::numeric))
    ELSE 0
  END AS value_cents
FROM analytics_events
WHERE event_name = 'checkout_completed'
  AND created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'

ORDER BY sort_order;

COMMENT ON VIEW v_revenue_kpis IS 'Revenue KPIs for last 30 days: AOV, total revenue, order count, avg items.';

-- =============================================================================
-- Period Comparison View
-- =============================================================================
CREATE OR REPLACE VIEW v_period_comparison AS
SELECT
  metric_name,
  SUM(CASE WHEN date >= CURRENT_DATE - 30 THEN metric_value ELSE 0 END) AS current_period,
  SUM(CASE WHEN date >= CURRENT_DATE - 60 AND date < CURRENT_DATE - 30 THEN metric_value ELSE 0 END) AS previous_period,
  CASE
    WHEN SUM(CASE WHEN date >= CURRENT_DATE - 60 AND date < CURRENT_DATE - 30 THEN metric_value ELSE 0 END) > 0
    THEN ROUND(
      ((SUM(CASE WHEN date >= CURRENT_DATE - 30 THEN metric_value ELSE 0 END) -
        SUM(CASE WHEN date >= CURRENT_DATE - 60 AND date < CURRENT_DATE - 30 THEN metric_value ELSE 0 END))
       / SUM(CASE WHEN date >= CURRENT_DATE - 60 AND date < CURRENT_DATE - 30 THEN metric_value ELSE 0 END)) * 100,
      1
    )
    ELSE NULL
  END AS change_pct
FROM analytics_daily_metrics
WHERE date >= CURRENT_DATE - 60
GROUP BY metric_name
ORDER BY metric_name;

COMMENT ON VIEW v_period_comparison IS 'Current vs previous 30-day period comparison with % change.';
