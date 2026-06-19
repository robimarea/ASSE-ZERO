import { useEffect, useRef, useState } from 'react';

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

/** Philosophy: reveal quando il curtain è uscito (pct >= revealPct), hide quando torna a coprire (pct < hidePct) */
export function useMaskCurtainReveal(revealPct = 0.80, hidePct = 0.76) {
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

      const rect = wrapper.getBoundingClientRect();
      const wrapperH = rect.height;
      const vh = window.innerHeight;
      const scrollProgress = -rect.top;
      const totalRange = wrapperH - vh;

      const pct = totalRange > 0
        ? Math.max(0, Math.min(1, scrollProgress / totalRange))
        : 0;

      setIsRevealed((prev) => {
        if (!prev && pct >= revealPct) return true;
        if (prev && pct < hidePct) return false;
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
  }, [revealPct, hidePct]);

  return { ref, isRevealed };
}
