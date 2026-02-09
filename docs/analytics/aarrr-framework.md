# AARRR Analytics Framework

**Datum:** 2026-02-09
**Status:** ✅ Implemented
**VINO Issue:** VINO-168

---

## Overview

Het AARRR framework (Acquisition, Activation, Retention, Revenue, Referral) biedt een holistische view op de customer journey van VINO12. Met **MAWCM** (Monthly Active Wine Club Members) als North Star Metric, tracken we alle vijf fasen van klantbetrokkenheid.

---

## Framework Components

### 1. Acquisition (Verkrijging)

**Definitie:** Hoe komen bezoekers bij VINO12?

**Metrics:**
| Metric | Definitie | Target | Berekeningsmethode |
|--------|-----------|--------|-------------------|
| **Dagelijkse bezoekers** | Unieke bezoekers per dag | 500+ | Plausible Analytics |
| **Traffic sources** | Verdeling kanalen (organic, paid, referral) | 50% organic | Plausible Analytics |
| **Conversion rate (visit→signup)** | % bezoekers dat zich aanmeldt | 5%+ | `signup_events / page_views` |

**SQL (Supabase):**

```sql
-- Dagelijkse acquisitie trend
SELECT
  date,
  COUNT(DISTINCT user_id) as daily_signups,
  COUNT(DISTINCT session_id) as sessions
FROM acquisition_events
WHERE event_type = 'signup'
  AND date >= CURRENT_DATE - 30
GROUP BY date
ORDER BY date DESC;
```

---

### 2. Activation (Activatie)

**Definitie:** Maken nieuwe gebruikers hun **eerste aankoop binnen 7 dagen**?

**Metrics:**
| Metric | Definitie | Target | Berekeningsmethode |
|--------|-----------|--------|-------------------|
| **Activation rate** | % nieuwe users die binnen 7 dagen kopen | 25%+ | `first_orders / signups` (7d window) |
| **Time to first order** | Gemiddelde tijd tussen signup en eerste order | <3 dagen | `AVG(first_order_at - created_at)` |
| **Abandoned carts** | % carts die niet afronden | <30% | `abandoned_carts / created_carts` |

**SQL (Supabase):**

```sql
-- Activation rate (7 dagen)
SELECT
  DATE_TRUNC('month', u.created_at) as cohort_month,
  COUNT(DISTINCT u.id) as signups,
  COUNT(DISTINCT o.user_id) as activated_users,
  ROUND(100.0 * COUNT(DISTINCT o.user_id) / COUNT(DISTINCT u.id), 2) as activation_rate_pct
FROM auth.users u
LEFT JOIN orders o
  ON u.id = o.user_id
  AND o.created_at <= u.created_at + INTERVAL '7 days'
WHERE u.created_at >= CURRENT_DATE - 180
GROUP BY cohort_month
ORDER BY cohort_month DESC;
```

---

### 3. Retention (Retentie)

**Definitie:** Komen klanten terug voor herhaalaankopen?

**Metrics:**
| Metric | Definitie | Target | Berekeningsmethode |
|--------|-----------|--------|-------------------|
| **Repeat purchase rate** | % klanten met 2+ orders | 40%+ | `users_with_2plus_orders / total_customers` |
| **Churn rate (monthly)** | % MAWCM die stopt dit maand | <10% | `churned_members / mawcm_last_month` |
| **Purchase frequency** | Gemiddelde orders per klant per jaar | 6+ | `total_orders / active_customers / years` |

**SQL (Supabase):**

```sql
-- Repeat purchase rate
SELECT
  COUNT(DISTINCT user_id) as total_customers,
  COUNT(DISTINCT CASE WHEN order_count >= 2 THEN user_id END) as repeat_customers,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN order_count >= 2 THEN user_id END) / COUNT(DISTINCT user_id), 2) as repeat_rate_pct
FROM (
  SELECT user_id, COUNT(*) as order_count
  FROM orders
  WHERE created_at >= CURRENT_DATE - 365
  GROUP BY user_id
) cohort;
```

---

### 4. Revenue (Omzet)

**Definitie:** Hoeveel verdienen we per klant?

**Metrics:**
| Metric | Definitie | Target | Berekeningsmethode |
|--------|-----------|--------|-------------------|
| **MRR** | Monthly Recurring Revenue (wine club abonnementen) | €10k+ | `SUM(subscription_amount)` |
| **Average Order Value (AOV)** | Gemiddelde orderwaarde | €60+ | `total_revenue / order_count` |
| **Customer Lifetime Value (LTV)** | Totale waarde per klant over lifetime | €360+ | `AOV * avg_orders_per_customer` |
| **LTV:CAC ratio** | Lifetime value vs customer acquisition cost | 3:1+ | `LTV / CAC` |

**SQL (Supabase):**

```sql
-- Revenue metrics (maandelijks)
SELECT
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as order_count,
  SUM(total_amount) as total_revenue,
  ROUND(AVG(total_amount), 2) as aov,
  ROUND(SUM(total_amount) / COUNT(DISTINCT user_id), 2) as revenue_per_customer
FROM orders
WHERE created_at >= CURRENT_DATE - 180
GROUP BY month
ORDER BY month DESC;
```

---

### 5. Referral (Doorverwijzing)

**Definitie:** Verwijzen tevreden klanten anderen door?

**Metrics:**
| Metric | Definitie | Target | Berekeningsmethode |
|--------|-----------|--------|-------------------|
| **Referral rate** | % klanten die iemand doorverwijzen | 15%+ | `referrers / total_customers` |
| **Viral coefficient** | Gemiddeld aantal succesvolle referrals per klant | 0.5+ | `successful_referrals / total_customers` |
| **NPS (Net Promoter Score)** | Would recommend? (promoters - detractors) | 50+ | Survey tool |

**SQL (Supabase):**

```sql
-- Referral rate
SELECT
  COUNT(DISTINCT referrer_id) as referrers,
  COUNT(DISTINCT referred_user_id) as successful_referrals,
  ROUND(100.0 * COUNT(DISTINCT referrer_id) / (SELECT COUNT(*) FROM auth.users), 2) as referral_rate_pct,
  ROUND(COUNT(DISTINCT referred_user_id)::numeric / (SELECT COUNT(*) FROM auth.users), 3) as viral_coefficient
FROM referrals
WHERE created_at >= CURRENT_DATE - 90;
```

---

## AARRR & North Star Metric (MAWCM)

Het AARRR framework **voedt** de North Star Metric:

```
Acquisition → nieuwe bezoekers
    ↓
Activation → eerste aankoop (wordt deel van MAWCM)
    ↓
Retention → herhaalaankopen (verhoogt MAWCM)
    ↓
Revenue → LTV per MAWCM lid
    ↓
Referral → nieuwe leden via bestaande MAWCM
```

**Voorbeeld:**

- **Doel:** MAWCM groei van 500 → 750 (50% groei in 6 maanden)
- **AARRR strategie:**
  - **Acquisition:** +30% traffic via SEO
  - **Activation:** Verbeter onboarding (25% → 35% activation rate)
  - **Retention:** Verlaag churn (10% → 7%)
  - **Revenue:** Verhoog AOV met upsells (€60 → €75)
  - **Referral:** Lanceer "friend gets 10% off" programma

---

## Metabase Dashboard Setup

### Docker Compose

**File:** `docker-compose.yml`

```yaml
services:
  metabase:
    image: metabase/metabase:latest
    container_name: vino12-metabase
    ports:
      - "3200:3000"
    environment:
      MB_DB_TYPE: postgres
      MB_DB_DBNAME: metabase
      MB_DB_PORT: 5432
      MB_DB_USER: ${SUPABASE_DB_USER}
      MB_DB_PASS: ${SUPABASE_DB_PASSWORD}
      MB_DB_HOST: ${SUPABASE_DB_HOST}
    volumes:
      - metabase-data:/metabase-data
    depends_on:
      - postgres
    restart: unless-stopped

volumes:
  metabase-data:
```

**Start Metabase:**

```bash
docker-compose up -d metabase
```

**Access Dashboard:**

- URL: http://localhost:3200
- First login: Create admin account
- Connect to Supabase: Add PostgreSQL data source

---

### Dashboard Widgets

**Acquisition Section:**

- Line chart: Daily signups (30 days)
- Bar chart: Traffic sources breakdown
- Number widget: Conversion rate %

**Activation Section:**

- Number widget: Activation rate (7 days)
- Histogram: Time to first order distribution
- Trend chart: Abandoned cart rate

**Retention Section:**

- Cohort table: Repeat purchase rate by month
- Line chart: Monthly churn rate
- Number widget: Purchase frequency

**Revenue Section:**

- Number widget: MRR (Monthly Recurring Revenue)
- Line chart: AOV trend (90 days)
- Metric: LTV (Customer Lifetime Value)

**Referral Section:**

- Number widget: Referral rate %
- Bar chart: Successful referrals per month
- Metric: Viral coefficient

---

## Alerts & Monitoring

| Metric          | Threshold | Alert Action                                |
| --------------- | --------- | ------------------------------------------- |
| Activation rate | <20%      | Email: "Onboarding broken?"                 |
| Churn rate      | >15%      | Slack: "#analytics - investigate retention" |
| AOV             | <€50      | Email: "Check upsell strategy"              |
| Referral rate   | <10%      | Slack: "Referral program review"            |

**Setup in Metabase:**

1. Create alert per metric
2. Set threshold conditions
3. Configure Slack/email notifications

---

## A/B Testing Integration (GrowthBook)

AARRR metrics zijn **primary metrics** voor A/B tests:

| Test                     | Primary Metric      | Success Criteria |
| ------------------------ | ------------------- | ---------------- |
| Homepage CTA copy        | Activation rate     | +5% lift         |
| Onboarding flow redesign | Time to first order | -1 day           |
| Upsell modal timing      | AOV                 | +€10 increase    |
| Referral incentive       | Referral rate       | +5% lift         |

**Example (from `growthbook-setup.md`):**

```tsx
const ctaCopy = useFeature(
  FeatureFlags.MAWCM_EXPERIMENT_CTA,
  "Join Vino12 Club",
);
// GrowthBook tracks conversion to MAWCM signup as success event
```

---

## Troubleshooting

### Metabase Not Loading

```bash
# Check container status
docker ps | grep metabase

# Check logs
docker logs vino12-metabase

# Verify Supabase connection
docker exec vino12-metabase nc -zv $SUPABASE_DB_HOST 5432
```

### Query Performance Issues

```sql
-- Add indexes for common queries
CREATE INDEX idx_orders_user_created ON orders (user_id, created_at);
CREATE INDEX idx_referrals_created ON referrals (created_at);
CREATE INDEX idx_users_created ON auth.users (created_at);
```

### Missing Data

```bash
# Verify daily_metrics calculation ran
SELECT * FROM daily_metrics
WHERE date >= CURRENT_DATE - 7
ORDER BY date DESC;

# Manual trigger if needed
SELECT calculate_daily_metrics();
```

---

## Related Documents

- **North Star Metric:** `docs/analytics/north-star-metric.md` (VINO-170)
- **GrowthBook A/B Testing:** `docs/analytics/growthbook-setup.md` (VINO-167)
- **Metabase Docs:** https://www.metabase.com/docs/

---

## Changelog

| Datum      | Wijziging                             | Auteur            |
| ---------- | ------------------------------------- | ----------------- |
| 2026-02-09 | Initial AARRR framework documentation | Claude Sonnet 4.5 |
