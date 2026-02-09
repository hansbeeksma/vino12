# E2E Test Specs

## Conversion Funnel Tests

**File:** `conversion-funnel.spec.ts`

Tests de complete conversion funnel tracking voor VINO12 analytics.

### Funnel Stages

| Stage           | Event Type         | Trigger                             |
| --------------- | ------------------ | ----------------------------------- |
| 1. Visit        | `page_visit`       | Navigate to `/wijnen`               |
| 2. Product View | `product_viewed`   | Click wine → detail page            |
| 3. Add to Cart  | `add_to_cart`      | Click "In winkelwagen" button       |
| 4. Checkout     | `checkout_started` | Navigate to `/afrekenen`            |
| 5. Order        | `order_completed`  | Submit checkout form → success page |

### Test Coverage

- ✅ **Happy path**: Complete funnel from visit to order
- ✅ **Session tracking**: Validates `session_id` consistency
- ✅ **Event structure**: Validates required fields (session_id, device_type, browser)
- ✅ **Event ordering**: Validates chronological event sequence
- ✅ **Error handling**: Page functionality works even if tracking fails

### Running Tests

**Option 1: Via npm script**

```bash
npm run e2e -- conversion-funnel.spec.ts
```

**Option 2: Via helper script**

```bash
./scripts/test-conversion-funnel.sh
```

**Option 3: Direct Playwright**

```bash
npx playwright test e2e/specs/conversion-funnel.spec.ts
```

### Prerequisites

1. **Dev server running**

   ```bash
   rm -rf .next  # Clear Turbopack cache if needed
   npm run dev
   ```

2. **Supabase migrations applied** (optional for tracking test)
   ```bash
   supabase db reset
   # or
   supabase migration up
   ```

### Test Strategy

Tests use **API route mocking** to:

- Intercept `/api/analytics/funnel` calls
- Capture event payloads
- Validate event structure and ordering
- Simulate success responses (no real DB writes)

This approach ensures:

- ⚡ Fast test execution (no DB roundtrips)
- 🔒 No test data pollution
- 🎯 Focused validation of client-side tracking logic

### Debugging

**View screenshots on failure:**

```bash
open playwright-report/index.html
```

**Run with headed browser:**

```bash
npm run e2e:headed -- conversion-funnel.spec.ts
```

**Run with UI mode:**

```bash
npm run e2e:ui
```

### Related Documentation

- Conversion funnel spec: `docs/analytics/conversion-funnel.md`
- Funnel tracker implementation: `src/lib/analytics/funnel-tracker.ts`
- API route: `src/app/api/analytics/funnel/route.ts`
- SQL schema: `supabase/migrations/016_conversion_funnel.sql`

## Other Test Specs

- **smoke.spec.ts**: Basic smoke tests (homepage, critical paths)
- **age-verification.spec.ts**: Age gate compliance (18+ requirement)
- **checkout.spec.ts**: Checkout flow with Mollie integration
- **admin-auth.spec.ts**: Admin authentication flows
- **supabase-e2e.spec.ts**: Supabase integration tests
- **accessibility.spec.ts**: WCAG 2.2 AA compliance tests

## Visual Regression Tests

Located in `e2e/visual/`:

- **pages.spec.ts**: Visual snapshots of all pages
- **components.spec.ts**: Component-level visual regression

Run with:

```bash
npm run e2e:visual
```

Update snapshots:

```bash
npm run e2e:visual:update
```
