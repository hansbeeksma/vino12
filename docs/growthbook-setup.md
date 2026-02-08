# GrowthBook Setup Guide

## Docker Infrastructure ✅

Containers configured and running:

- **GrowthBook**: http://localhost:3100 (UI)
- **GrowthBook API**: http://localhost:3101
- **MongoDB**: Internal (port 27017)

## React Integration ✅

### Provider Setup

```tsx
// src/lib/growthbook/GrowthBookProvider.tsx
- GrowthBook React SDK installed
- Provider wraps root layout
- Analytics tracking callback configured
- User attributes: deviceType, url
```

### Environment Variables

```env
NEXT_PUBLIC_GROWTHBOOK_API_HOST=http://localhost:3101
NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY=<to-be-generated>
```

## Getting Started

### 1. Access Dashboard

```bash
# Containers should be running
docker-compose ps | grep growthbook

# Open dashboard
open http://localhost:3100
```

### 2. First-Time Setup

1. Create account (local, no email verification)
2. Create organization
3. Create first SDK Connection (JavaScript/React)
4. Copy **Client Key** → `.env.local`

### 3. Create First Feature Flag

**Example: "new-checkout-flow"**

```javascript
// In component
import { useFeature } from "@growthbook/growthbook-react";

export function CheckoutButton() {
  const newCheckout = useFeature("new-checkout-flow").on;

  return <button>{newCheckout ? "Secure Checkout →" : "Checkout"}</button>;
}
```

### 4. Create First Experiment

**Example: "product-card-cta"**

- **Hypothesis**: Changing CTA from "Bekijk" to "Ontdek" increases clicks
- **Variations**:
  - Control (50%): "Bekijk"
  - Variant A (50%): "Ontdek"
- **Metric**: Click-through rate (tracked via analytics)
- **North Star Metric**: MAWCM (monthly active wine club members)

### 5. Link to MAWCM Metric

In GrowthBook dashboard:

1. Navigate to **Metrics**
2. Create new metric: "MAWCM"
3. SQL query (or API endpoint):
   ```sql
   SELECT COUNT(DISTINCT user_id)
   FROM subscriptions
   WHERE status = 'active'
   AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
   ```
4. Link metric to experiments

## Feature Flag Examples

### Simple Boolean Flag

```typescript
const showNewFeature = useFeature("new-feature").on;
```

### A/B Test Variant

```typescript
const variant = useFeature("checkout-cta").value;
// Returns: "control" | "variant-a" | "variant-b"
```

### Multivariate Test

```typescript
const config = useFeature("product-card-layout").value;
// Returns: { layout: "grid" | "list", cardSize: "small" | "medium" | "large" }
```

## Testing Locally

### Force Feature On/Off

```typescript
// In browser console
gb.setAttributes({ id: "test-user-123", forcedVariation: "variant-a" });
gb.loadFeatures();
```

### Dev Mode

- Enabled automatically in development
- Shows experiment assignments in console
- Allows overriding via URL params: `?gb-override-feature-name=value`

## Production Checklist

- [ ] CLIENT_KEY in production `.env`
- [ ] Analytics tracking verified (gtag events)
- [ ] Feature flags tested in staging
- [ ] Experiment targeting rules configured
- [ ] Metrics connected to Supabase
- [ ] MAWCM metric tracking verified

## Troubleshooting

### Features not loading

```bash
# Check API connectivity
curl http://localhost:3101/api/features/<CLIENT_KEY>

# Check container logs
docker-compose logs growthbook
```

### Experiments not tracking

- Verify `window.gtag` is available
- Check network tab for analytics calls
- Confirm trackingCallback fires

## Next Steps

1. ✅ Complete initial setup in dashboard
2. Create "new-checkout-flow" feature flag
3. Create "product-card-cta" A/B test
4. Link MAWCM metric
5. Deploy to staging and test

---

**Documentation**: https://docs.growthbook.io/
**Dashboard**: http://localhost:3100
