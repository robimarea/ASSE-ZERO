import { useEffect } from 'react';
import { createLenis, destroyLenis } from '@/lib/lenis';

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = createLenis();

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      destroyLenis();
    };
  }, []);
}
