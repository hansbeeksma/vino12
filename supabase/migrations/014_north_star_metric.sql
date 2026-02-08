-- Migration 014: North Star Metric (MAWCM)
-- Monthly Active Wine Club Members - VINO-170

-- =============================================================================
-- North Star Metric Calculation Function
-- =============================================================================
CREATE OR REPLACE FUNCTION calculate_mawcm(target_month DATE)
RETURNS TABLE (
  mawcm INTEGER,
  mawcm_new INTEGER,
  mawcm_retained INTEGER,
  mawcm_reactivated INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  previous_month DATE := target_month - INTERVAL '1 month';
  month_start DATE := date_trunc('month', target_month)::date;
  month_end DATE := (date_trunc('month', target_month) + INTERVAL '1 month - 1 day')::date;
BEGIN
  RETURN QUERY
  WITH
  -- Active wine club members in target month
  active_this_month AS (
    SELECT DISTINCT wcs.customer_id
    FROM wine_club_subscriptions wcs
    WHERE
      wcs.status = 'active'
      AND wcs.created_at::date <= month_end
      AND (wcs.cancelled_at IS NULL OR wcs.cancelled_at::date >= month_start)
      -- Had at least 1 order in target month
      AND EXISTS (
        SELECT 1
        FROM orders o
        WHERE o.customer_id = wcs.customer_id
          AND o.status = 'completed'
          AND o.created_at::date BETWEEN month_start AND month_end
      )
  ),
  -- Active wine club members in previous month
  active_prev_month AS (
    SELECT DISTINCT wcs.customer_id
    FROM wine_club_subscriptions wcs
    WHERE
      wcs.status = 'active'
      AND wcs.created_at::date <= (date_trunc('month', previous_month) + INTERVAL '1 month - 1 day')::date
      AND (wcs.cancelled_at IS NULL OR wcs.cancelled_at::date >= date_trunc('month', previous_month)::date)
      AND EXISTS (
        SELECT 1
        FROM orders o
        WHERE o.customer_id = wcs.customer_id
          AND o.status = 'completed'
          AND o.created_at::date BETWEEN
            date_trunc('month', previous_month)::date
            AND (date_trunc('month', previous_month) + INTERVAL '1 month - 1 day')::date
      )
  ),
  -- New members (active this month, not in any previous month)
  new_members AS (
    SELECT customer_id
    FROM active_this_month atm
    WHERE NOT EXISTS (
      SELECT 1
      FROM orders o
      WHERE o.customer_id = atm.customer_id
        AND o.status = 'completed'
        AND o.created_at < month_start
    )
  ),
  -- Retained members (active both this month and previous month)
  retained_members AS (
    SELECT atm.customer_id
    FROM active_this_month atm
    INNER JOIN active_prev_month apm ON atm.customer_id = apm.customer_id
  ),
  -- Reactivated members (active this month, NOT active prev month, but active before that)
  reactivated_members AS (
    SELECT atm.customer_id
    FROM active_this_month atm
    WHERE NOT EXISTS (
      SELECT 1 FROM active_prev_month apm WHERE apm.customer_id = atm.customer_id
    )
    AND EXISTS (
      SELECT 1
      FROM orders o
      WHERE o.customer_id = atm.customer_id
        AND o.status = 'completed'
        AND o.created_at < date_trunc('month', previous_month)::date
    )
  )
  SELECT
    (SELECT COUNT(*) FROM active_this_month)::INTEGER AS mawcm,
    (SELECT COUNT(*) FROM new_members)::INTEGER AS mawcm_new,
    (SELECT COUNT(*) FROM retained_members)::INTEGER AS mawcm_retained,
    (SELECT COUNT(*) FROM reactivated_members)::INTEGER AS mawcm_reactivated;
END;
$$;

COMMENT ON FUNCTION calculate_mawcm IS
'Calculate Monthly Active Wine Club Members (North Star Metric) with breakdown: new, retained, reactivated.';

-- =============================================================================
-- Extend calculate_daily_metrics to include MAWCM
-- =============================================================================
CREATE OR REPLACE FUNCTION calculate_daily_metrics(target_date DATE DEFAULT CURRENT_DATE - 1)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  mawcm_data RECORD;
  target_month DATE := date_trunc('month', target_date)::date;
BEGIN
  -- Existing metrics (page_views, unique_visitors, etc.)
  -- ... keep existing code from 012_analytics.sql ...

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

  -- =============================================================================
  -- NEW: North Star Metric (MAWCM) - Monthly rollup
  -- =============================================================================
  -- Only calculate on the last day of each month or when target_date is in the past
  IF target_date < CURRENT_DATE AND target_date = (date_trunc('month', target_date) + INTERVAL '1 month - 1 day')::date THEN
    -- Get MAWCM breakdown for the target month
    SELECT * INTO mawcm_data FROM calculate_mawcm(target_month);

    -- Insert MAWCM total
    INSERT INTO analytics_daily_metrics (date, metric_name, metric_value)
    VALUES (target_date, 'mawcm', mawcm_data.mawcm)
    ON CONFLICT (date, metric_name)
    DO UPDATE SET metric_value = EXCLUDED.metric_value, updated_at = now();

    -- Insert MAWCM breakdown
    INSERT INTO analytics_daily_metrics (date, metric_name, metric_value)
    VALUES (target_date, 'mawcm_new', mawcm_data.mawcm_new)
    ON CONFLICT (date, metric_name)
    DO UPDATE SET metric_value = EXCLUDED.metric_value, updated_at = now();

    INSERT INTO analytics_daily_metrics (date, metric_name, metric_value)
    VALUES (target_date, 'mawcm_retained', mawcm_data.mawcm_retained)
    ON CONFLICT (date, metric_name)
    DO UPDATE SET metric_value = EXCLUDED.metric_value, updated_at = now();

    INSERT INTO analytics_daily_metrics (date, metric_name, metric_value)
    VALUES (target_date, 'mawcm_reactivated', mawcm_data.mawcm_reactivated)
    ON CONFLICT (date, metric_name)
    DO UPDATE SET metric_value = EXCLUDED.metric_value, updated_at = now();

    -- Calculate churn (previous month active - current month retained - current month reactivated)
    INSERT INTO analytics_daily_metrics (date, metric_name, metric_value)
    VALUES (
      target_date,
      'mawcm_churned',
      (
        SELECT COALESCE(
          (SELECT metric_value FROM analytics_daily_metrics
           WHERE date = (target_month - INTERVAL '1 month')::date
             AND metric_name = 'mawcm'),
          0
        ) - mawcm_data.mawcm_retained
      )
    )
    ON CONFLICT (date, metric_name)
    DO UPDATE SET metric_value = EXCLUDED.metric_value, updated_at = now();
  END IF;
END;
$$;

COMMENT ON FUNCTION calculate_daily_metrics IS
'Calculate daily analytics rollups including North Star Metric (MAWCM). Call via Vercel Cron daily.';

-- =============================================================================
-- Helper view for easy NSM querying
-- =============================================================================
CREATE OR REPLACE VIEW north_star_trend AS
SELECT
  date,
  MAX(CASE WHEN metric_name = 'mawcm' THEN metric_value END) AS mawcm,
  MAX(CASE WHEN metric_name = 'mawcm_new' THEN metric_value END) AS new_members,
  MAX(CASE WHEN metric_name = 'mawcm_retained' THEN metric_value END) AS retained_members,
  MAX(CASE WHEN metric_name = 'mawcm_reactivated' THEN metric_value END) AS reactivated_members,
  MAX(CASE WHEN metric_name = 'mawcm_churned' THEN metric_value END) AS churned_members,
  -- Growth rate
  LAG(MAX(CASE WHEN metric_name = 'mawcm' THEN metric_value END)) OVER (ORDER BY date) AS prev_month_mawcm,
  ROUND(
    (MAX(CASE WHEN metric_name = 'mawcm' THEN metric_value END) -
     LAG(MAX(CASE WHEN metric_name = 'mawcm' THEN metric_value END)) OVER (ORDER BY date))
    / NULLIF(LAG(MAX(CASE WHEN metric_name = 'mawcm' THEN metric_value END)) OVER (ORDER BY date), 0) * 100,
    2
  ) AS mom_growth_pct
FROM analytics_daily_metrics
WHERE metric_name IN ('mawcm', 'mawcm_new', 'mawcm_retained', 'mawcm_reactivated', 'mawcm_churned')
GROUP BY date
ORDER BY date DESC;

COMMENT ON VIEW north_star_trend IS
'Pivoted view of North Star Metric with month-over-month growth rate. Use for dashboards.';
