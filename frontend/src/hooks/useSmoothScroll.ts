import { useEffect } from 'react';
import Lenis from 'lenis';
import { notifyScroll } from '@/lib/scrollBridge';

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.55,
      touchMultiplier: 1.2,
      prevent: (node) => node instanceof Element && Boolean(node.closest('[data-carousel-scroll]')),
    });

    lenis.on('scroll', notifyScroll);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}
