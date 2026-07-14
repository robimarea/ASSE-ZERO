import { useEffect, useRef, useState } from 'react';
import { MASK_PHASES, REVEAL_HYSTERESIS, getMaskProgress } from '@/lib/maskProgress';
import { getViewportHeight } from '@/lib/viewport';

const REVEAL_PCT = MASK_PHASES.contentStable;
const HIDE_PCT   = MASK_PHASES.wipeOutEnd + REVEAL_HYSTERESIS;

interface UseRevealOptions {
  threshold?: number;
  rootMargin?: string;
}

/** Reveal ripetibile: entra ed esce con lo scroll (su e giù) */
export function useReveal(options: UseRevealOptions = {}) {
  const { threshold = 0.25, rootMargin = '0px' } = options;
  const ref = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsRevealed(entry.isIntersecting),
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, isRevealed };
}

/** Philosophy: reveal quando il curtain è uscito (pct >= REVEAL_PCT), hide quando torna a coprire (pct < HIDE_PCT) */
export function useMaskCurtainReveal() {
  const ref = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId = 0;

    const check = () => {
      rafId = 0;
      const wrapper = el.closest('[data-mask-wrapper]');
      if (!wrapper) return;

      const pct = getMaskProgress(wrapper, getViewportHeight());

      setIsRevealed((prev) => {
        if (!prev && pct >= REVEAL_PCT) return true;
        if (prev && pct < HIDE_PCT) return false;
        return prev;
      });
    };

    const onScroll = () => {
      if (rafId !== 0) return;
      rafId = requestAnimationFrame(check);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    check();

    return () => {
      if (rafId !== 0) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', check);
    };
  }, []);

  return { ref, isRevealed };
}
