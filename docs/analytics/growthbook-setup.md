# GrowthBook A/B Testing Setup

**Datum:** 2026-02-08
**Status:** ✅ Implemented
**VINO Issue:** VINO-167

---

## Overview

GrowthBook is configured for A/B testing and feature flags in VINO12, integrated with our North Star Metric (MAWCM) for measuring experiment impact.

---

## Infrastructure

### Docker Setup

**Services** (in `docker-compose.yml`):

```yaml
growthbook:
  image: growthbook/growthbook:latest
  ports:
    - "3100:3100" # Dashboard UI
    - "3101:3101" # API
  environment:
    MONGODB_URI: mongodb://mongo:27017/growthbook

mongo:
  image: mongo:7
  volumes:
    - mongo-data:/data/db
```

**Start Services:**

```bash
docker-compose up growthbook mongo
```

**Access Dashboard:**

- URL: http://localhost:3100
- First login: Create admin account

---

## React SDK Integration

### Provider Setup

**File:** `src/lib/growthbook/GrowthBookProvider.tsx`

```tsx
import { GrowthBookProvider } from "@/lib/growthbook/GrowthBookProvider";

// Wraps app in root layout
<GrowthBookProvider>{children}</GrowthBookProvider>;
```

**Environment Variables:**

```bash
NEXT_PUBLIC_GROWTHBOOK_API_HOST=http://localhost:3101
NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY=<from-dashboard>
```

### Usage in Components

**Type-safe hook:**

```tsx
import { useFeature, FeatureFlags } from "@/lib/growthbook/useFeature";

function HomePage() {
  const showNewHero = useFeature(FeatureFlags.NEW_HOMEPAGE_HERO, false);
  const recCount = useFeature(FeatureFlags.RECOMMENDATION_COUNT, 6);

  return (
    <div>
      {showNewHero ? <NewHeroSection /> : <OldHeroSection />}
      <Recommendations count={recCount} />
    </div>
  );
}
```

---

## First Experiment: MAWCM CTA Test

**Hypothesis:** Changing homepage CTA copy will increase wine club sign-ups (MAWCM).

### Setup in GrowthBook Dashboard

1. **Create Feature**
   - Key: `mawcm-experiment-cta`
   - Type: String
   - Default: `"Join Vino12 Club"`

2. **Create Experiment**
   - Name: "Homepage CTA Copy Test"
   - Key: `homepage-cta-test`
   - Variations:
     - Control (50%): "Join Vino12 Club"
     - Variant A (25%): "Start Your Wine Journey"
     - Variant B (25%): "12 Wijnen. Perfecte Match."
   - **Primary Metric**: MAWCM (Monthly Active Wine Club Members)
   - **Secondary Metrics**: Click-through rate, Conversion rate

3. **Targeting**
   - Attribute: `deviceType`
   - Filter: All (both mobile and desktop)

### Implementation

```tsx
import { useFeature, FeatureFlags } from "@/lib/growthbook/useFeature";

function HeroSection() {
  const ctaCopy = useFeature(
    FeatureFlags.MAWCM_EXPERIMENT_CTA,
    "Join Vino12 Club",
  );

  return (
    <section>
      <h1>6 Rood. 6 Wit. Perfecte Balans.</h1>
      <button>{ctaCopy}</button>
    </section>
  );
}
```

### Measuring Impact

**Query MAWCM** (after 2 weeks):

```sql
-- Compare MAWCM before/during experiment
SELECT
  date,
  mawcm,
  mom_growth_pct
FROM north_star_trend
WHERE date >= '2026-02-01'
ORDER BY date DESC;
```

**GrowthBook Analytics:**

- Auto-tracks experiment views via `trackingCallback`
- Manual conversion tracking: Call GB when user signs up
- Results dashboard shows statistical significance

---

## Feature Flags Available

| Flag                   | Type    | Default   | Purpose                         |
| ---------------------- | ------- | --------- | ------------------------------- |
| `new-homepage-hero`    | boolean | false     | Gradual rollout new hero design |
| `show-wine-club-cta`   | boolean | true      | Toggle wine club CTA visibility |
| `new-checkout-flow`    | boolean | false     | Test new checkout UX            |
| `recommendation-count` | number  | 6         | A/B test recommendation count   |
| `enable-ai-sommelier`  | boolean | false     | AI-powered wine recommendations |
| `mawcm-experiment-cta` | string  | "Join..." | CTA copy experiment (MAWCM)     |

---

## Best Practices

### 1. Always Set Defaults

```tsx
// ✅ GOOD
const enabled = useFeature("my-feature", false);

// ❌ BAD (no fallback)
const enabled = useFeature("my-feature");
```

### 2. Use Type-Safe Keys

```tsx
// ✅ GOOD (autocomplete + type safety)
import { FeatureFlags } from "@/lib/growthbook/useFeature";
const enabled = useFeature(FeatureFlags.NEW_HOMEPAGE_HERO, false);

// ❌ BAD (typo risk)
const enabled = useFeature("new-homepge-hero", false);
```

### 3. Track Experiment Impact on MAWCM

- All experiments should measure MAWCM impact (primary or secondary)
- Use GrowthBook's Bayesian statistics for significance testing
- Run experiments for minimum 2 weeks (2 monthly cycles)

### 4. Gradual Rollouts

```
1. QA (10%) → 1 day
2. Beta (25%) → 3 days
3. Majority (75%) → 1 week
4. Full (100%) → permanent or remove flag
```

---

## Troubleshooting

### Feature Not Loading

```bash
# Check Docker services
docker ps | grep -E "(growthbook|mongo)"

# Check GrowthBook logs
docker logs vino12-growthbook

# Verify API key in .env.local
echo $NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY
```

### Experiment Not Tracking

1. Open browser console
2. Check `gtag` events: `experiment_viewed`
3. Verify GrowthBook dashboard shows impressions

### MAWCM Integration

```sql
-- Verify MAWCM tracking is working
SELECT * FROM north_star_trend
WHERE date >= CURRENT_DATE - 30
ORDER BY date DESC;
```

---

## Related Documents

- **North Star Metric:** `docs/analytics/north-star-metric.md` (VINO-170)
- **AARRR Dashboard:** `docs/analytics/aarrr-framework.md` (VINO-168)
- **GrowthBook Docs:** https://docs.growthbook.io/

---

## Changelog

| Datum      | Wijziging                               | Auteur            |
| ---------- | --------------------------------------- | ----------------- |
| 2026-02-08 | Initial setup + first experiment design | Claude Sonnet 4.5 |
