# Metabase Setup Guide - AARRR Dashboard

**Datum:** 2026-02-09
**Status:** ✅ Implemented
**VINO Issue:** VINO-168

---

## Overview

Metabase is onze primaire analytics tool voor AARRR metrics visualization. Deze guide toont de complete setup van Supabase verbinding tot het AARRR dashboard.

---

## 1. Start Metabase

### Docker Compose

Metabase draait al in `docker-compose.yml` (service: `metabase`).

**Start service:**

```bash
cd ~/Development/products/vino12
docker-compose up -d metabase
```

**Verify running:**

```bash
docker ps | grep metabase
# vino12-metabase ... Up ... 0.0.0.0:3200->3000/tcp
```

**Access Dashboard:**

- URL: http://localhost:3200
- Container port: 3000 (mapped to host 3200)

**Logs (if issues):**

```bash
docker logs vino12-metabase
```

---

## 2. Initial Setup

### First Login

1. Open http://localhost:3200
2. Click **"Let's get started"**
3. Create admin account:
   - Email: `admin@vino12.com`
   - Password: (generate strong password, store in 1Password)
   - First name: `VINO12`
   - Last name: `Admin`
4. Click **"Next"**

### Skip Optional Steps

- **Add your data**: Click **"I'll add my data later"** (we'll do manual setup)
- **Usage data preferences**: Toggle OFF (GDPR compliance)
- Click **"Take me to Metabase"**

---

## 3. Connect Supabase PostgreSQL

### Get Supabase Connection Details

**From Supabase Dashboard:**

1. Go to https://supabase.com/dashboard/project/{your-project-id}
2. Navigate to **Settings → Database**
3. Copy connection details:

| Field    | Value                          |
| -------- | ------------------------------ |
| Host     | `db.{project-ref}.supabase.co` |
| Port     | `5432`                         |
| Database | `postgres`                     |
| Username | `postgres`                     |
| Password | (your database password)       |

**Or from local `.env.local`:**

```bash
grep SUPABASE ~/.env.local
# NEXT_PUBLIC_SUPABASE_URL=https://{project-ref}.supabase.co
# Extract project-ref: db.{project-ref}.supabase.co
```

### Add Database Connection

1. In Metabase, click **Settings (gear icon)** → **Admin settings**
2. Navigate to **Databases** tab
3. Click **"Add database"**
4. Fill in connection details:

| Field             | Value                          |
| ----------------- | ------------------------------ |
| **Database type** | PostgreSQL                     |
| **Name**          | `VINO12 Supabase`              |
| **Host**          | `db.{project-ref}.supabase.co` |
| **Port**          | `5432`                         |
| **Database name** | `postgres`                     |
| **Username**      | `postgres`                     |
| **Password**      | (your Supabase password)       |

5. **Advanced options:**
   - SSL Mode: `require` (Supabase requires SSL)
   - Additional JDBC options: (leave empty)
6. Click **"Save"**
7. Wait for connection test: **"Connection successful"** ✅

**Troubleshooting:**

- ❌ Connection timeout → Check host name, firewall
- ❌ Authentication failed → Verify password
- ❌ SSL error → Ensure SSL Mode = `require`

---

## 4. Sync Database Schema

After successful connection:

1. Metabase shows **"Syncing database..."** notification
2. Wait ~30 seconds for schema scan
3. Navigate to **Browse Data** → **VINO12 Supabase**
4. Verify tables/views appear:
   - `acquisition_metrics`
   - `activation_metrics`
   - `retention_metrics`
   - `revenue_metrics`
   - `referral_metrics`
   - `aarrr_dashboard` ← Primary view

**If views missing:**

```bash
# Apply migration manually
cd ~/Development/products/vino12
supabase db reset  # Or run migration:
supabase migration up 015_aarrr_metrics.sql
```

---

## 5. Create AARRR Dashboard

### 5.1 Create New Dashboard

1. Click **"New"** → **"Dashboard"**
2. Name: `AARRR Overview`
3. Description: `Acquisition, Activation, Retention, Revenue, Referral metrics`
4. Click **"Create"**

### 5.2 Add Widgets

#### Widget 1: Acquisition - Daily Signups (Line Chart)

1. Click **"Add a question"**
2. **Data source**: `VINO12 Supabase` → `acquisition_metrics` view
3. **Query:**
   - Visualization: **Line**
   - X-axis: `date` (Date)
   - Y-axis: `daily_signups` (Count)
   - Filter: Last 30 days
4. **Chart settings:**
   - Title: `Daily Signups (30d)`
   - Goal line: 20 signups/day (optional)
5. Click **"Save"** → Add to **AARRR Overview** dashboard

**SQL alternative (for custom time ranges):**

```sql
SELECT
  date,
  daily_signups
FROM acquisition_metrics
WHERE date >= CURRENT_DATE - 30
ORDER BY date ASC;
```

---

#### Widget 2: Activation - Activation Rate % (Number + Trend)

1. **New question** → **Native query**
2. **SQL:**

```sql
SELECT
  cohort_month,
  activation_rate_pct
FROM activation_metrics
ORDER BY cohort_month DESC
LIMIT 6;
```

3. **Visualization**: **Number** (show latest month)
4. **Display:**
   - Label: `Activation Rate`
   - Show trend arrow (compare to previous month)
   - Target: 25% (add goal line)
5. **Save** → Add to dashboard

---

#### Widget 3: Retention - Repeat Purchase Rate (Gauge)

1. **New question** → **Native query**
2. **SQL:**

```sql
SELECT
  repeat_rate_pct
FROM retention_metrics
WHERE cohort_month = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
LIMIT 1;
```

3. **Visualization**: **Gauge**
4. **Gauge settings:**
   - Min: 0%, Max: 100%
   - Target: 40% (green zone starts here)
   - Ranges:
     - 0-20%: Red (poor retention)
     - 20-40%: Yellow (needs improvement)
     - 40%+: Green (good retention)
5. **Save** → Add to dashboard

---

#### Widget 4: Revenue - Monthly Revenue Breakdown (Stacked Bar)

1. **New question** → **Native query**
2. **SQL:**

```sql
SELECT
  month,
  mrr as "MRR (Subscriptions)",
  one_time_revenue as "One-time Sales"
FROM revenue_metrics
WHERE month >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months')
ORDER BY month ASC;
```

3. **Visualization**: **Bar (stacked)**
4. **Chart settings:**
   - X-axis: `month`
   - Y-axis: Revenue (€)
   - Stack by: MRR vs One-time
   - Colors: Blue (MRR), Green (One-time)
5. **Save** → Add to dashboard

---

#### Widget 5: Revenue - Average Order Value (AOV Trend)

1. **New question** → **Native query**
2. **SQL:**

```sql
SELECT
  month,
  aov
FROM revenue_metrics
WHERE month >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months')
ORDER BY month ASC;
```

3. **Visualization**: **Line**
4. **Chart settings:**
   - Show data points: Yes
   - Goal line: €60 (target AOV)
   - Trend line: Yes (show if AOV increasing/decreasing)
5. **Save** → Add to dashboard

---

#### Widget 6: Referral - Viral Coefficient (Number)

1. **New question** → **Native query**
2. **SQL:**

```sql
SELECT
  viral_coefficient
FROM referral_metrics
WHERE month = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
LIMIT 1;
```

3. **Visualization**: **Number**
4. **Display:**
   - Label: `Viral Coefficient`
   - Target: 0.5 (each customer brings 0.5 new customers)
   - Interpretation:
     - <0.5: Growth via marketing
     - 0.5-1.0: Sustainable viral growth
     - > 1.0: Exponential viral growth
5. **Save** → Add to dashboard

---

#### Widget 7: AARRR Unified View (Table)

1. **New question** → **Native query**
2. **SQL:**

```sql
SELECT
  month,
  acquisition_signups as "Signups",
  ROUND(activation_rate, 1) || '%' as "Activation",
  ROUND(retention_repeat_rate, 1) || '%' as "Retention",
  '€' || ROUND(revenue_total) as "Revenue",
  '€' || ROUND(revenue_aov, 2) as "AOV",
  ROUND(referral_viral_coefficient, 2) as "Viral Coeff"
FROM aarrr_dashboard
ORDER BY month DESC
LIMIT 6;
```

3. **Visualization**: **Table**
4. **Table settings:**
   - Column headers: Bold
   - Alternating row colors: Yes
   - Highlight latest month: Green background
5. **Save** → Add to dashboard

---

### 5.3 Dashboard Layout

**Recommended grid (3 columns, 2 rows):**

```
┌────────────────────┬────────────────────┬────────────────────┐
│ Daily Signups (30d)│ Activation Rate %  │ Repeat Purchase %  │
│ (Line chart)       │ (Number + trend)   │ (Gauge)            │
├────────────────────┴────────────────────┴────────────────────┤
│ Monthly Revenue Breakdown (Stacked Bar - full width)         │
├────────────────────┬────────────────────┬────────────────────┤
│ AOV Trend (Line)   │ Viral Coefficient  │                    │
│                    │ (Number)           │                    │
└────────────────────┴────────────────────┴────────────────────┘
│ AARRR Unified Table (full width, bottom)                     │
└───────────────────────────────────────────────────────────────┘
```

**Drag & resize widgets** to match layout above.

---

## 6. Dashboard Filters

Add time range filter to dashboard:

1. Click dashboard **"Edit"** button
2. Click **"Add a filter"** → **Date filter**
3. Name: `Time Range`
4. Map to questions:
   - Daily Signups → `date` field
   - Activation Rate → `cohort_month` field
   - Retention → `cohort_month` field
   - Revenue → `month` field
   - Referral → `month` field
5. Default: Last 6 months
6. **Save** dashboard

**Users can now:**

- Select custom date ranges (last 30/90/180 days, YTD, etc.)
- Compare different time periods

---

## 7. Alerts & Subscriptions

### Email Subscriptions

Send weekly AARRR digest to stakeholders:

1. Click dashboard **"..." menu** → **"Subscriptions and alerts"**
2. Click **"Create a subscription"**
3. **Frequency**: Weekly (Monday 9 AM)
4. **Recipients**: Add stakeholder emails
5. **Format**: Dashboard image + data tables
6. **Save subscription**

### Threshold Alerts

Alert when metrics drop below targets:

1. Open specific widget (e.g., Activation Rate)
2. Click widget **"..." menu** → **"Create alert"**
3. **Condition**: `activation_rate_pct < 20`
4. **Frequency**: Check daily
5. **Recipients**: `analytics@vino12.com`
6. **Message**: "⚠️ Activation rate dropped below 20%"
7. **Save alert**

**Recommended alerts:**
| Metric | Threshold | Alert Message |
|--------|-----------|---------------|
| Activation Rate | <20% | Onboarding broken? |
| Repeat Rate | <30% | Retention crisis |
| AOV | <€50 | Check upsell strategy |
| Viral Coefficient | <0.3 | Referral program review |

---

## 8. Performance Optimization

### Index Verification

Ensure these indexes exist (created in migration):

```sql
-- Check existing indexes
SELECT tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('orders', 'referrals');
```

**Expected indexes:**

- `idx_orders_user_created` → orders(user_id, created_at)
- `idx_orders_created_month` → orders(DATE_TRUNC('month', created_at))
- `idx_referrals_referrer` → referrals(referrer_id, created_at)
- `idx_referrals_status` → referrals(status)

### Query Caching

1. Go to **Admin settings** → **Caching**
2. Enable **"Cache query results"**
3. **Default TTL**: 24 hours (views update daily)
4. **Minimum query duration**: 1 second (cache slow queries)

### Scheduled Syncs

1. Go to **Admin settings** → **Databases** → **VINO12 Supabase**
2. Click **"Scheduling"** tab
3. **Sync schema**: Daily at 3 AM
4. **Scan field values**: Weekly

---

## 9. Troubleshooting

### View Returns No Data

**Check if migration ran:**

```bash
supabase db reset
# Or manually:
psql $DATABASE_URL -f supabase/migrations/015_aarrr_metrics.sql
```

**Verify views exist:**

```sql
SELECT table_name
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name LIKE '%metrics%';
```

### Performance Issues

**Slow query (>5 seconds):**

1. Check execution plan:

```sql
EXPLAIN ANALYZE
SELECT * FROM aarrr_dashboard;
```

2. Add missing indexes (see migration)
3. Reduce date range (last 90 days instead of 365)

**Dashboard timeout:**

- Increase Metabase query timeout: **Admin → Settings → Query timeout: 60s**
- Pre-aggregate data with materialized views (future optimization)

### Connection Errors

**SSL required:**

```bash
# Test connection from Docker container
docker exec vino12-metabase nc -zv db.{project-ref}.supabase.co 5432
```

**Firewall blocking:**

- Check Supabase IP restrictions (Settings → Database → IP restrictions)
- Allow Metabase container IP (or disable IP restrictions for development)

---

## 10. Access Control

### User Roles

**Admin (full access):**

- Dashboard editing
- Query creation
- Database connections

**Viewer (read-only):**

- View dashboards
- Export data
- No editing rights

**Create viewer accounts:**

1. **Admin settings** → **People**
2. Click **"Invite someone"**
3. Email: `stakeholder@vino12.com`
4. Role: **Viewer** (not Admin)
5. Send invite

### Dashboard Permissions

1. Open **AARRR Overview** dashboard
2. Click **"..." menu** → **"Sharing and embedding"**
3. **Public link**: OFF (sensitive data)
4. **Accessible to**: All users (or specific groups)
5. **Save settings**

---

## 11. Integration with GrowthBook

AARRR metrics are **primary success metrics** for A/B tests.

**Example: Homepage CTA test (from VINO-167)**

- **Test**: MAWCM CTA copy experiment
- **Primary metric**: Activation rate (% users completing first purchase)
- **Secondary metrics**: Time to first order, AOV

**Connect GrowthBook to Metabase:**

1. GrowthBook dashboard: http://localhost:3100
2. Add experiment result: Link to Metabase widget URL
3. Metabase widget shows statistical significance

**Dashboard:** http://localhost:3200/dashboard/1 (AARRR Overview)

---

## 12. Next Steps

- [ ] Create **Conversion Funnel** dashboard (VINO-169)
- [ ] Add **Customer Segmentation** (by LTV quartiles)
- [ ] Build **Cohort Analysis** (retention by signup month)
- [ ] Integrate **Plausible Analytics** (traffic sources)
- [ ] Setup **Slack notifications** for critical alerts

---

## Related Documents

- **AARRR Framework:** `docs/analytics/aarrr-framework.md` (VINO-168)
- **North Star Metric:** `docs/analytics/north-star-metric.md` (VINO-170)
- **GrowthBook Setup:** `docs/analytics/growthbook-setup.md` (VINO-167)
- **SQL Migration:** `supabase/migrations/015_aarrr_metrics.sql`
- **Metabase Docs:** https://www.metabase.com/docs/

---

## Changelog

| Datum      | Wijziging                                        | Auteur            |
| ---------- | ------------------------------------------------ | ----------------- |
| 2026-02-09 | Initial Metabase setup guide for AARRR dashboard | Claude Sonnet 4.5 |
