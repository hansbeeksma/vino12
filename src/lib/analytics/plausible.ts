/**
 * Plausible Analytics — Custom Events
 *
 * GDPR-compliant, cookieless analytics. Script tag in root layout.tsx.
 * Custom events fire only when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set.
 *
 * @see https://plausible.io/docs/custom-event-goals
 */

type PlausibleArgs = [
  string,
  { callback?: () => void; props?: Record<string, string | number | boolean> },
];

declare global {
  interface Window {
    plausible?: (...args: PlausibleArgs) => void;
  }
}

function trackEvent(
  eventName: string,
  props?: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined") return;
  if (!window.plausible) return;

  window.plausible(eventName, { props: props ?? {} });
}

/** Visitor adds wine to cart */
export function trackAddToCart(wineName: string, price: number) {
  trackEvent("Add to Cart", { wine: wineName, price });
}

/** Visitor starts checkout */
export function trackBeginCheckout(itemCount: number, total: number) {
  trackEvent("Begin Checkout", { items: itemCount, total });
}

/** Purchase completed (Mollie webhook confirmed) */
export function trackPurchase(orderId: string, total: number) {
  trackEvent("Purchase", { order_id: orderId, total });
}

/** Visitor signs up for wine club */
export function trackWineClubSignup() {
  trackEvent("Wine Club Signup");
}

/** Visitor submits a review */
export function trackReviewSubmit(wineSlug: string, rating: number) {
  trackEvent("Review Submit", { wine: wineSlug, rating });
}

/** Visitor uses search */
export function trackSearch(query: string) {
  trackEvent("Search", { query });
}

/** Visitor views wine detail page */
export function trackWineView(wineSlug: string) {
  trackEvent("Wine View", { wine: wineSlug });
}

/** Newsletter signup */
export function trackNewsletterSignup() {
  trackEvent("Newsletter Signup");
}
