# Conversion Funnel Analytics

**Datum:** 2026-02-09
**Status:** ✅ Implemented
**VINO Issue:** VINO-169

---

## Overview

De conversion funnel toont het klanttraject van eerste bezoek tot betaling. Door drop-off percentages per stap te meten, identificeren we waar we klanten verliezen en waar optimalisatie het grootste effect heeft.

---

## Funnel Stages

### 5-Step Funnel

```
1. Visit (Bezoek)
   ↓ Drop-off: ~95%
2. Product View (Product bekeken)
   ↓ Drop-off: ~70%
3. Add to Cart (Winkelwagen)
   ↓ Drop-off: ~50%
4. Checkout (Afrekenen)
   ↓ Drop-off: ~30%
5. Paid (Betaald)
   ✓ Conversion!
```

### Stage Definitions

| Stage               | Definition                      | Tracking Event                           | Target Conversion       |
| ------------------- | ------------------------------- | ---------------------------------------- | ----------------------- |
| **1. Visit**        | User lands on VINO12            | Plausible pageview                       | 100% (baseline)         |
| **2. Product View** | Views any `/wijnen/[slug]` page | `product_viewed` event                   | 5-10% of visits         |
| **3. Add to Cart**  | Adds product to cart            | `add_to_cart` event                      | 30-40% of product views |
| **4. Checkout**     | Starts checkout flow            | `checkout_started` event                 | 50-60% of carts         |
| **5. Paid**         | Completes payment               | `order_completed` event (Mollie webhook) | 70-80% of checkouts     |

**Overall Conversion Rate Target:** 1-2% (visit → paid)

---

## Event Tracking

### Event Schema

Events worden getrackt in `funnel_events` table:

```sql
CREATE TABLE funnel_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  event_data JSONB,
  device_type TEXT,
  browser TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Event Types

| Event Type         | Triggered When             | Event Data                                  |
| ------------------ | -------------------------- | ------------------------------------------- |
| `page_visit`       | Any page load              | `{page: "/wijnen", referrer: "google.com"}` |
| `product_viewed`   | Product detail page        | `{product_id: "uuid", product_name: "..."}` |
| `add_to_cart`      | Add to cart button clicked | `{product_id: "uuid", quantity: 1}`         |
| `checkout_started` | Checkout page loaded       | `{cart_value: 59.99, item_count: 2}`        |
| `order_completed`  | Mollie payment confirmed   | `{order_id: "uuid", total_amount: 59.99}`   |

### Client-Side Tracking (Next.js)

**Implementation:**

```tsx
// src/lib/analytics/funnel-tracker.ts
export function trackFunnelEvent(
  eventType: string,
  eventData?: Record<string, any>,
) {
  const sessionId = getOrCreateSessionId(); // localStorage
  const deviceType = window.innerWidth < 768 ? "mobile" : "desktop";
  const browser = navigator.userAgent.includes("Chrome")
    ? "chrome"
    : navigator.userAgent.includes("Safari")
      ? "safari"
      : navigator.userAgent.includes("Firefox")
        ? "firefox"
        : "other";

  fetch("/api/analytics/funnel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: sessionId,
      event_type: eventType,
      event_data: eventData,
      device_type: deviceType,
      browser: browser,
    }),
  });
}

// Usage in components
trackFunnelEvent("product_viewed", {
  product_id: product.id,
  product_name: product.name,
});
```

**API Route (`/api/analytics/funnel`):**

```tsx
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createClient();
  const body = await request.json();

  const { data, error } = await supabase.from("funnel_events").insert({
    session_id: body.session_id,
    user_id: body.user_id || null,
    event_type: body.event_type,
    event_data: body.event_data,
    device_type: body.device_type,
    browser: body.browser,
  });

  return Response.json({ success: !error });
}
```

---

## SQL Views for Metabase

### 1. Funnel Overview (All Steps)

```sql
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
  -- Conversion rates
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
```

### 2. Device Breakdown

```sql
CREATE OR REPLACE VIEW funnel_by_device AS
WITH funnel_by_device AS (
  SELECT
    device_type,
    COUNT(DISTINCT CASE WHEN event_type = 'page_visit' THEN session_id END) as visits,
    COUNT(DISTINCT CASE WHEN event_type = 'order_completed' THEN session_id END) as orders
  FROM funnel_events
  WHERE created_at >= CURRENT_DATE - 30
  GROUP BY device_type
)
SELECT
  device_type,
  visits,
  orders,
  ROUND(100.0 * orders / NULLIF(visits, 0), 2) as conversion_rate_pct
FROM funnel_by_device
ORDER BY visits DESC;
```

### 3. Browser Breakdown

```sql
CREATE OR REPLACE VIEW funnel_by_browser AS
WITH funnel_by_browser AS (
  SELECT
    browser,
    COUNT(DISTINCT CASE WHEN event_type = 'page_visit' THEN session_id END) as visits,
    COUNT(DISTINCT CASE WHEN event_type = 'order_completed' THEN session_id END) as orders
  FROM funnel_events
  WHERE created_at >= CURRENT_DATE - 30
  GROUP BY browser
)
SELECT
  browser,
  visits,
  orders,
  ROUND(100.0 * orders / NULLIF(visits, 0), 2) as conversion_rate_pct
FROM funnel_by_browser
ORDER BY visits DESC;
```

### 4. Time Period Comparison

```sql
CREATE OR REPLACE FUNCTION get_funnel_comparison(
  period_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  period TEXT,
  visits BIGINT,
  orders BIGINT,
  conversion_rate NUMERIC,
  change_pct NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH current_period AS (
    SELECT
      COUNT(DISTINCT CASE WHEN event_type = 'page_visit' THEN session_id END) as visits,
      COUNT(DISTINCT CASE WHEN event_type = 'order_completed' THEN session_id END) as orders
    FROM funnel_events
    WHERE created_at >= CURRENT_DATE - period_days
  ),
  previous_period AS (
    SELECT
      COUNT(DISTINCT CASE WHEN event_type = 'page_visit' THEN session_id END) as visits,
      COUNT(DISTINCT CASE WHEN event_type = 'order_completed' THEN session_id END) as orders
    FROM funnel_events
    WHERE created_at >= CURRENT_DATE - (period_days * 2)
      AND created_at < CURRENT_DATE - period_days
  )
  SELECT
    'Current' as period,
    cp.visits,
    cp.orders,
    ROUND(100.0 * cp.orders / NULLIF(cp.visits, 0), 2) as conversion_rate,
    ROUND(100.0 * (cp.orders::numeric - pp.orders) / NULLIF(pp.orders, 0), 2) as change_pct
  FROM current_period cp, previous_period pp
  UNION ALL
  SELECT
    'Previous' as period,
    pp.visits,
    pp.orders,
    ROUND(100.0 * pp.orders / NULLIF(pp.visits, 0), 2) as conversion_rate,
    0.0 as change_pct
  FROM previous_period pp;
END;
$$ LANGUAGE plpgsql;
```

---

## Metabase Dashboard Widgets

### Widget 1: Funnel Visualization (Sankey Diagram)

**Query:**

```sql
SELECT
  'Visit' as stage,
  'Product View' as next_stage,
  SUM(product_views) as value
FROM funnel_overview
WHERE date >= CURRENT_DATE - 30
UNION ALL
SELECT
  'Product View' as stage,
  'Add to Cart' as next_stage,
  SUM(add_to_carts) as value
FROM funnel_overview
WHERE date >= CURRENT_DATE - 30
UNION ALL
SELECT
  'Add to Cart' as stage,
  'Checkout' as next_stage,
  SUM(checkouts) as value
FROM funnel_overview
WHERE date >= CURRENT_DATE - 30
UNION ALL
SELECT
  'Checkout' as stage,
  'Paid' as next_stage,
  SUM(orders) as value
FROM funnel_overview
WHERE date >= CURRENT_DATE - 30;
```

**Visualization:** Sankey (flow diagram)
**Title:** Conversion Funnel (30d)

---

### Widget 2: Drop-Off Table

**Query:**

```sql
SELECT
  'Visit → Product' as step,
  ROUND(AVG(visit_dropoff_pct), 1) || '%' as drop_off_rate,
  SUM(visits - product_views) as lost_users
FROM funnel_overview
WHERE date >= CURRENT_DATE - 30
UNION ALL
SELECT
  'Product → Cart' as step,
  ROUND(AVG(product_dropoff_pct), 1) || '%' as drop_off_rate,
  SUM(product_views - add_to_carts) as lost_users
FROM funnel_overview
WHERE date >= CURRENT_DATE - 30
UNION ALL
SELECT
  'Cart → Checkout' as step,
  ROUND(AVG(cart_dropoff_pct), 1) || '%' as drop_off_rate,
  SUM(add_to_carts - checkouts) as lost_users
FROM funnel_overview
WHERE date >= CURRENT_DATE - 30
UNION ALL
SELECT
  'Checkout → Paid' as step,
  ROUND(AVG(checkout_dropoff_pct), 1) || '%' as drop_off_rate,
  SUM(checkouts - orders) as lost_users
FROM funnel_overview
WHERE date >= CURRENT_DATE - 30
ORDER BY lost_users DESC;
```

**Visualization:** Table
**Title:** Drop-Off Analysis (30d)

---

### Widget 3: Device Performance (Bar Chart)

**Query:**

```sql
SELECT * FROM funnel_by_device;
```

**Visualization:** Bar (horizontal)
**Title:** Conversion by Device

---

### Widget 4: Conversion Trend (Line Chart)

**Query:**

```sql
SELECT
  date,
  overall_conversion_pct
FROM funnel_overview
WHERE date >= CURRENT_DATE - 90
ORDER BY date ASC;
```

**Visualization:** Line
**Title:** Overall Conversion Rate (90d)

---

### Widget 5: Period Comparison (Number Cards)

**Query:**

```sql
SELECT * FROM get_funnel_comparison(30);
```

**Visualization:** Two number cards (Current vs Previous)
**Title:** 30-Day Comparison

---

## Dashboard Filters

**Time Period Filter:**

- Last 7 days
- Last 30 days (default)
- Last 90 days
- Custom date range

**Device Filter:**

- All devices
- Mobile only
- Desktop only

**Applied to all widgets** via dashboard-level filters.

---

## Optimization Insights

### High Drop-Off Points

| Stage               | Typical Drop-Off | Optimization Strategy                                        |
| ------------------- | ---------------- | ------------------------------------------------------------ |
| **Visit → Product** | 90-95%           | SEO, landing page optimization, clearer value prop           |
| **Product → Cart**  | 60-70%           | Product page UX, pricing clarity, trust signals              |
| **Cart → Checkout** | 40-50%           | Remove distractions, show shipping costs early, trust badges |
| **Checkout → Paid** | 20-30%           | Simplify checkout, guest checkout, payment method variety    |

### Device-Specific Issues

**If mobile conversion < 50% of desktop:**

- Check mobile UX (tap targets, form fields)
- Optimize page load speed (mobile networks)
- Test payment flow on mobile

**If specific browser has low conversion:**

- Cross-browser testing
- JavaScript errors in DevTools
- Payment integration compatibility

---

## A/B Testing Integration (GrowthBook)

Funnel drop-offs are **primary targets** for A/B tests:

| Test                    | Target Stage             | Success Metric         |
| ----------------------- | ------------------------ | ---------------------- |
| New product page layout | Product → Cart           | +10% add-to-cart rate  |
| Trust badge on checkout | Checkout → Paid          | +5% completion rate    |
| Guest checkout option   | Cart → Checkout          | +15% checkout starts   |
| Mobile-optimized cart   | Cart → Checkout (mobile) | +20% mobile conversion |

**Link to GrowthBook:**

- Each experiment references funnel stage
- Conversion rate = primary success metric
- Dashboard shows before/after comparison

---

## Alerts & Monitoring

**Critical Alerts:**

| Metric                   | Threshold | Alert Action                 |
| ------------------------ | --------- | ---------------------------- |
| Overall conversion rate  | <0.5%     | Email: "Funnel broken?"      |
| Checkout completion rate | <50%      | Slack: "Payment issue?"      |
| Mobile conversion        | <0.3%     | Email: "Mobile UX broken?"   |
| Product view rate        | <3%       | Slack: "Landing page issue?" |

---

## Troubleshooting

### Events Not Tracking

**Check client-side:**

```javascript
// Browser console
trackFunnelEvent("test_event", { test: true });
// Should send POST to /api/analytics/funnel
```

**Check API route:**

```bash
curl -X POST http://localhost:3000/api/analytics/funnel \
  -H "Content-Type: application/json" \
  -d '{"session_id":"test","event_type":"test_event"}'
```

**Check database:**

```sql
SELECT * FROM funnel_events
ORDER BY created_at DESC
LIMIT 10;
```

### Drop-Off Calculation Errors

**Verify session tracking:**

- Same session_id across all events in user journey
- localStorage persistence (not cleared between pages)
- Session timeout handling (24 hours)

**Verify event ordering:**

```sql
SELECT session_id, event_type, created_at
FROM funnel_events
WHERE session_id = 'test-session-id'
ORDER BY created_at ASC;
```

---

## Related Documents

- **AARRR Framework:** `docs/analytics/aarrr-framework.md` (VINO-168)
- **Metabase Setup:** `docs/analytics/metabase-setup.md` (VINO-168)
- **GrowthBook A/B Testing:** `docs/analytics/growthbook-setup.md` (VINO-167)
- **SQL Migration:** `supabase/migrations/016_conversion_funnel.sql`

---

## Changelog

| Datum      | Wijziging                               | Auteur            |
| ---------- | --------------------------------------- | ----------------- |
| 2026-02-09 | Initial conversion funnel documentation | Claude Sonnet 4.5 |
