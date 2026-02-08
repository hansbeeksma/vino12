"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type RefObject,
} from "react";

interface ScrollProgress {
  progress: number;
  isVisible: boolean;
}

/**
 * Hook that tracks scroll progress of a section element.
 * Returns 0 when section enters viewport, 1 when it leaves.
 */
export function useTheatreScroll(
  sectionRef: RefObject<HTMLElement | null>,
): ScrollProgress {
  const [state, setState] = useState<ScrollProgress>({
    progress: 0,
    isVisible: false,
  });
  const rafRef = useRef<number>(0);

  const updateProgress = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const viewHeight = window.innerHeight;

    // 0 when top of section hits bottom of viewport
    // 1 when bottom of section hits top of viewport
    const totalDistance = viewHeight + rect.height;
    const traveled = viewHeight - rect.top;
    const progress = Math.max(0, Math.min(1, traveled / totalDistance));
    const isVisible = rect.bottom > 0 && rect.top < viewHeight;

    setState((prev) => {
      if (
        Math.abs(prev.progress - progress) < 0.001 &&
        prev.isVisible === isVisible
      ) {
        return prev;
      }
      return { progress, isVisible };
    });
  }, [sectionRef]);

  useEffect(() => {
    const handleScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    updateProgress();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [updateProgress]);

  return state;
}
