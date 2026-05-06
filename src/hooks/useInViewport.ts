// ============================================
// ASSE ZERO — useInViewport Hook
// ============================================

import { useState, useEffect, RefObject } from 'react';

interface UseInViewportOptions {
  threshold?: number | number[];
  rootMargin?: string;
  once?: boolean;
}

/**
 * Hook to detect if an element is within the viewport.
 */
export function useInViewport(
  ref: RefObject<HTMLElement | null>,
  options: UseInViewportOptions = {}
): boolean {
  const [isIntersecting, setIntersecting] = useState(false);
  const { threshold = 0, rootMargin = '0px', once = false } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
        
        // If 'once' is true and we've intersected, stop observing
        if (entry.isIntersecting && once) {
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, rootMargin, once]);

  return isIntersecting;
}
