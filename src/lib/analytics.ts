import {
  AnalyticsTracker,
  hasAnalyticsConsent,
  type EventName,
  type EventPropertyMap,
} from "@rooseveltops/analytics-layer";

const CONSENT_COOKIE = "vino12_cookie_consent";

let tracker: AnalyticsTracker | null = null;

function getTracker(): AnalyticsTracker {
  if (!tracker) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error("Supabase env vars not configured for analytics");
    }

    tracker = new AnalyticsTracker({
      supabaseUrl: url,
      supabaseServiceKey: key,
    });
  }
  return tracker;
}

/**
 * Server-side event tracking (API routes, Server Components, webhooks).
 * Always tracks — no consent check needed for server-side business events.
 */
export async function trackServerEvent<T extends EventName>(
  eventName: T,
  properties: EventPropertyMap[T],
  context?: {
    sessionId?: string;
    userId?: string;
    pageUrl?: string;
    referrer?: string;
    userAgent?: string;
  },
): Promise<void> {
  try {
    await getTracker().trackEvent(eventName, properties, context);
  } catch {
    // Analytics should never break the main flow
  }
}

/**
 * Client-initiated event tracking (called from API routes on behalf of client).
 * Checks consent from cookie header before tracking.
 */
export async function trackConsentAwareEvent<T extends EventName>(
  eventName: T,
  properties: EventPropertyMap[T],
  cookieHeader: string,
  context?: {
    sessionId?: string;
    userId?: string;
    pageUrl?: string;
    referrer?: string;
    userAgent?: string;
  },
): Promise<void> {
  if (!hasAnalyticsConsent(cookieHeader, CONSENT_COOKIE)) {
    return;
  }

  await trackServerEvent(eventName, properties, context);
}
