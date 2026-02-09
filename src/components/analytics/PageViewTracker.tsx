"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAnalytics } from "@/hooks/useAnalytics";

/**
 * Tracks page_viewed events on route changes.
 * Place once in the root layout.
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const { track } = useAnalytics();
  const prevPathname = useRef<string | null>(null);

  useEffect(() => {
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;

    track("page_viewed", {
      path: pathname,
      referrer: document.referrer || "",
      title: document.title,
    });
  }, [pathname, track]);

  return null;
}
