"use client";

import { useCallback, useRef } from "react";
import type {
  EventName,
  EventPropertyMap,
} from "@rooseveltops/analytics-layer";

function getSessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("analytics_session_id", sessionId);
  }
  return sessionId;
}

export function useAnalytics() {
  const pendingRef = useRef(false);

  const track = useCallback(
    async <T extends EventName>(
      eventName: T,
      properties: EventPropertyMap[T],
    ) => {
      if (pendingRef.current) return;
      pendingRef.current = true;

      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event_name: eventName,
            properties,
            session_id: getSessionId(),
            page_url: window.location.pathname,
          }),
          keepalive: true,
        });
      } catch {
        // Analytics should never break the UI
      } finally {
        pendingRef.current = false;
      }
    },
    [],
  );

  return { track };
}
