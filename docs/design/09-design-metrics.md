---
project: "VINO12"
version: "1.0.0"
last_updated: "2026-02-08"
maturity: "foundation"
status: "draft"
owner: "Sam Swaab"
---

# VINO12 Design Metrics

> KPIs, Conversie, en Usability Metrics

---

## Primary KPIs

| Metric                             | Target   | Measurement       |
| ---------------------------------- | -------- | ----------------- |
| Conversion rate (visit → purchase) | > 2.5%   | Analytics         |
| Cart abandonment rate              | < 65%    | Funnel analysis   |
| Average order value (AOV)          | > EUR 50 | Order data        |
| Time to first purchase             | < 5 min  | Session recording |
| Return customer rate               | > 30%    | Customer data     |

## HEART Framework

| Dimension        | Signal                     | Metric                | Target |
| ---------------- | -------------------------- | --------------------- | ------ |
| **Happiness**    | Post-purchase satisfaction | NPS score             | > 40   |
| **Engagement**   | Browse depth               | Pages per session     | > 3    |
| **Adoption**     | New visitors purchasing    | First-time conversion | > 1.5% |
| **Retention**    | Repeat purchases           | 90-day return rate    | > 25%  |
| **Task Success** | Checkout completion        | Checkout success rate | > 80%  |

---

## Conversion Funnel

| Step             | Expected Rate | Drop-off Target |
| ---------------- | ------------- | --------------- |
| Landing page     | 100%          | -               |
| Browse wines     | 60%           | < 40%           |
| Product detail   | 35%           | < 25%           |
| Add to cart      | 15%           | < 20%           |
| Begin checkout   | 10%           | < 5%            |
| Complete payment | 7%            | < 3%            |

---

## Design System Health

| Metric                           | Target | Measurement                  |
| -------------------------------- | ------ | ---------------------------- |
| Design token coverage            | > 95%  | Grep for hardcoded values    |
| Component reuse rate             | > 80%  | Shared vs one-off components |
| Accessibility score (Lighthouse) | > 90   | CI pipeline                  |
| Custom CSS overrides             | < 5%   | Code review                  |

---

## A/B Testing Backlog

| Priority | Hypothesis                                              | Variant                       | Primary Metric      |
| -------- | ------------------------------------------------------- | ----------------------------- | ------------------- |
| P1       | Grotere product images verhogen conversie               | Larger WineCard images        | Add-to-cart rate    |
| P1       | "Populair" badge op bestsellers verhoogt sales          | SocialProofIndicator on cards | Conversion rate     |
| P2       | Simplified checkout (fewer fields) verlaagt abandonment | Single-page checkout          | Checkout completion |
| P2       | Wine recommendations verhogen AOV                       | "Vaak samen besteld" section  | Average order value |

---

_Template: ~/Development/shared/communicating-design/templates/09-design-metrics.md_
