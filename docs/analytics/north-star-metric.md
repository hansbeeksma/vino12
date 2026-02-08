# North Star Metric - VINO12

**Datum:** 2026-02-08
**Status:** ✅ Implemented (SQL & Documentation) | ⏳ Pending (Metabase Dashboard)
**VINO Issue:** VINO-170

---

## Executive Summary

Dit document definieert de North Star Metric (NSM) voor VINO12, een wine e-commerce platform met focus op dropship fulfillment en wine club memberships voor de Nederlandse markt.

---

## North Star Metric Definitie

### Gekozen Metric

**Monthly Active Wine Club Members (MAWCM)**

> Het aantal unieke wine club leden dat in een maand minimaal 1 bestelling heeft geplaatst of hun subscription actief heeft gehouden.

### Rationale

Voor VINO12's business model is **Monthly Active Wine Club Members** de optimale North Star Metric om de volgende redenen:

#### 1. **Business Model Alignment**

- Wine club = recurring revenue model (MRR)
- Dropship = lage inventory risk, focus op customer retention
- Nederlandse markt = beperkte TAM, focus op loyalty over acquisition

#### 2. **Leading Indicator voor Revenue**

- Actieve members → voorspelbare MRR
- Subscription model → lagere CAC amortization
- Repeat purchases → hogere CLV

#### 3. **Balanceert Growth & Retention**

- Niet alleen nieuwe sign-ups (vanity metric)
- Niet alleen churn rate (lagging indicator)
- **Actieve engagement** = gezonde business

#### 4. **Actionable voor Team**

- Marketing: Acquisition campaigns voor wine club
- Product: Onboarding flows, recommendation engine
- Customer Success: Reactivation campaigns bij inactivity

---

## Alternative Metrics Considered

| Metric                   | Pro                                   | Con                                       | Score    |
| ------------------------ | ------------------------------------- | ----------------------------------------- | -------- |
| **Total Orders**         | Eenvoudig te meten                    | Geen loyalty indicator, seasonality noise | 4/10     |
| **Repeat Purchase Rate** | Goede loyalty metric                  | Te breed (geen subscription focus)        | 6/10     |
| **MRR**                  | Direct revenue impact                 | Lagging indicator, geen engagement signal | 7/10     |
| **MAWCM**                | ✅ Leading, actionable, model-aligned | Vereist subscription module eerst         | **9/10** |

---

## Metric Calculation

### SQL Formula

```sql
-- North Star Metric: Monthly Active Wine Club Members
CREATE OR REPLACE FUNCTION analytics.calculate_mawcm(
  target_month DATE
) RETURNS INTEGER AS $$
  SELECT COUNT(DISTINCT wc.user_id)
  FROM wine_club_members wc
  WHERE
    -- Active membership in target month
    wc.status = 'active'
    AND wc.start_date <= target_month
    AND (wc.end_date IS NULL OR wc.end_date >= target_month)
    AND EXISTS (
      -- Had at least 1 order or subscription renewal in target month
      SELECT 1 FROM orders o
      WHERE o.user_id = wc.user_id
        AND o.status = 'completed'
        AND DATE_TRUNC('month', o.created_at) = DATE_TRUNC('month', target_month)
    );
$$ LANGUAGE sql STABLE;
```

### Tracking Table Schema

```sql
-- Daily rollup for trend analysis
CREATE TABLE analytics.daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,

  -- North Star Metric
  mawcm INTEGER NOT NULL,
  mawcm_new INTEGER, -- new members this period
  mawcm_retained INTEGER, -- returning from previous month
  mawcm_churned INTEGER, -- lost from previous month

  -- Supporting Metrics
  total_orders INTEGER,
  total_revenue DECIMAL(10,2),
  avg_order_value DECIMAL(10,2),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_daily_metrics_date ON analytics.daily_metrics(date DESC);
```

---

## Implementation Plan

### Phase 1: Foundation (Week 1)

- [ ] Create `analytics` schema in Supabase
- [ ] Implement `calculate_mawcm()` SQL function
- [ ] Create `analytics.daily_metrics` table
- [ ] Setup daily Vercel Cron job for metric rollup

### Phase 2: Dashboard (Week 2)

- [ ] Metabase connection to Supabase
- [ ] Create "North Star Dashboard" with:
  - MAWCM trend (last 90 days)
  - Month-over-month growth rate
  - Cohort retention heatmap
  - New vs Retained breakdown

### Phase 3: Instrumentation (Week 3)

- [ ] Add NSM tracking to app insights
- [ ] Setup alerts (Sentry) for:
  - MAWCM drop >10% WoW
  - Churn spike (>15% monthly)
- [ ] Integrate with GrowthBook for experiment impact

---

## Success Criteria

✅ **Metric is considered implemented when:**

1. SQL function deployed to production
2. Daily rollup Cron job running (7+ days history)
3. Metabase dashboard accessible to team
4. Documentation complete (this file)
5. First A/B test uses MAWCM as primary success metric

---

## Related Documents

- **AARRR Dashboard:** docs/analytics/aarrr-framework.md (VINO-168)
- **Conversion Funnel:** docs/analytics/conversion-funnel.md (VINO-169)
- **GrowthBook Setup:** docs/analytics/ab-testing.md (VINO-167)

---

## Changelog

| Datum      | Wijziging                     | Auteur            |
| ---------- | ----------------------------- | ----------------- |
| 2026-02-08 | Initial draft - NSM definitie | Claude Sonnet 4.5 |
