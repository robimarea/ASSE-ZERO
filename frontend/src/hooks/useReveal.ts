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

/** Philosophy: reveal quando il curtain è uscito, hide quando torna a coprire (scroll su) */
export function useMaskCurtainReveal(revealRatio = 0.38, hideRatio = 0.52) {
  const ref = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId = 0;

    const check = () => {
      rafId = 0;
      const wrapper = el.closest('[data-mask-wrapper]');
      const curtain = wrapper?.querySelector('[data-mask-curtain]') as HTMLElement | null;
      if (!curtain) return;

      const bottom = curtain.getBoundingClientRect().bottom;
      const revealY = window.innerHeight * revealRatio;
      const hideY = window.innerHeight * hideRatio;

      setIsRevealed((prev) => {
        if (!prev && bottom <= revealY) return true;
        if (prev && bottom > hideY) return false;
        return prev;
      });
    };

    const onScroll = () => {
      if (rafId !== 0) return;
      rafId = requestAnimationFrame(check);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    check();
    return () => {
      if (rafId !== 0) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
    };
  }, [revealRatio, hideRatio]);

  return { ref, isRevealed };
}
