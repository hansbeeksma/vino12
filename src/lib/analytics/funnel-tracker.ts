// Funnel Event Tracker
// Tracks user journey through conversion funnel

type FunnelEventType =
  | "page_visit"
  | "product_viewed"
  | "add_to_cart"
  | "checkout_started"
  | "order_completed";

type DeviceType = "mobile" | "desktop" | "tablet";

interface FunnelEventData {
  session_id: string;
  user_id?: string;
  event_type: FunnelEventType;
  event_data?: Record<string, unknown>;
  device_type?: DeviceType;
  browser?: string;
  referrer?: string;
}

// Session ID management (localStorage)
const SESSION_KEY = "vino12_session_id";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";

  const stored = localStorage.getItem(SESSION_KEY);
  if (stored) {
    try {
      const { id, timestamp } = JSON.parse(stored);
      // Check if session expired
      if (Date.now() - timestamp < SESSION_DURATION) {
        return id;
      }
    } catch {
      // Invalid format, create new
    }
  }

  // Create new session
  const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ id: newId, timestamp: Date.now() }),
  );
  return newId;
}

// Device type detection
function getDeviceType(): DeviceType {
  if (typeof window === "undefined") return "desktop";

  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

// Browser detection (simplified)
function getBrowser(): string {
  if (typeof navigator === "undefined") return "unknown";

  const ua = navigator.userAgent;
  if (ua.includes("Chrome")) return "chrome";
  if (ua.includes("Safari")) return "safari";
  if (ua.includes("Firefox")) return "firefox";
  if (ua.includes("Edge")) return "edge";
  return "other";
}

// Track funnel event
export async function trackFunnelEvent(
  eventType: FunnelEventType,
  eventData?: Record<string, unknown>,
): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    const payload: FunnelEventData = {
      session_id: getOrCreateSessionId(),
      event_type: eventType,
      event_data: eventData || {},
      device_type: getDeviceType(),
      browser: getBrowser(),
      referrer: document.referrer || undefined,
    };

    // Send to API (fire and forget)
    await fetch("/api/analytics/funnel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    // Silent fail - don't disrupt user experience
    console.error("Funnel tracking error:", error);
  }
}

// Convenience methods
export const FunnelTracker = {
  pageVisit: (page: string) => trackFunnelEvent("page_visit", { page }),

  productViewed: (productId: string, productName: string) =>
    trackFunnelEvent("product_viewed", {
      product_id: productId,
      product_name: productName,
    }),

  addToCart: (productId: string, quantity: number = 1) =>
    trackFunnelEvent("add_to_cart", {
      product_id: productId,
      quantity,
    }),

  checkoutStarted: (cartValue: number, itemCount: number) =>
    trackFunnelEvent("checkout_started", {
      cart_value: cartValue,
      item_count: itemCount,
    }),

  orderCompleted: (orderId: string, totalAmount: number) =>
    trackFunnelEvent("order_completed", {
      order_id: orderId,
      total_amount: totalAmount,
    }),
};

// Hook for React components
export function useFunnelTracking() {
  return FunnelTracker;
}
