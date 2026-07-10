import { useEffect } from 'react';
import { createLenis, destroyLenis } from '@/lib/lenis';
import { notifyScroll } from '@/lib/scrollBridge';

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = createLenis();
    lenis.on('scroll', notifyScroll);

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
