import { useEffect, useRef, useState } from 'react';

interface UseRevealOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useReveal(options: UseRevealOptions = {}) {
  const { threshold = 0.25, rootMargin = '0px' } = options;
  const ref = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, isRevealed };
}

/** Reveal when the mask curtain above this section has mostly scrolled away */
export function useMaskCurtainReveal(curtainClearRatio = 0.38) {
  const ref = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || isRevealed) return;

    let rafId = 0;
    const check = () => {
      rafId = 0;
      const wrapper = el.closest('[data-mask-wrapper]');
      const curtain = wrapper?.querySelector('[data-mask-curtain]') as HTMLElement | null;
      if (!curtain) return;
      if (curtain.getBoundingClientRect().bottom <= window.innerHeight * curtainClearRatio) {
        setIsRevealed(true);
      }
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
  }, [isRevealed, curtainClearRatio]);

  return { ref, isRevealed };
}
