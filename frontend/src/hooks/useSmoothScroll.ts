import { useEffect } from 'react';
import Lenis from 'lenis';

// spring({ bounce: ~0.47, duration: 500 }) — oscillazione amplificata x1.25 rispetto a bounce 0.4
// approccio (0→0.9758) invariato; overshoot picco ~11.8% (era ~9.5%)
const SPRING_SAMPLES = [
  // approccio — invariato
  0, 0.0114, 0.0427, 0.0898, 0.149, 0.2169, 0.2906, 0.3673, 0.445, 0.5216,
  0.5958, 0.6663, 0.7321, 0.7926, 0.8474, 0.8962, 0.9389, 0.9758,
  // oscillazione — ampiezza x1.25 attorno a 1
  1.0086, 1.0406, 1.0663, 1.0861, 1.1006, 1.1105, 1.1163, 1.1184,
  1.1176, 1.1144, 1.1091, 1.1024, 1.0945, 1.0859, 1.0768, 1.0676,
  1.0585, 1.0496, 1.0411, 1.0333, 1.026, 1.0194, 1.0134, 1.0083,
  1.0038, 0.9999, 0.9968, 0.9941, 0.9921, 0.9908, 0.9896, 0.9891,
  0.9888, 0.9889, 0.9891, 0.9895, 0.9901, 0.9909, 0.9918, 0.9925,
  0.9934, 0.9943, 0.9951, 0.996, 0.9968, 0.9974, 0.998, 0.9986,
  0.9991, 0.9996, 1, 1.0003, 1.0005, 1.0008, 1.0009, 1.001,
  1.001, 1.001, 1.001, 1.001, 1.001, 1.001, 1.0009, 1.0008,
  1.0008, 1.0006, 1.0005, 1.0005, 1.0004, 1.0004, 1.0003, 1.0003,
  1.0001, 1.0001, 1, 1, 1, 1, 0.9999, 0.9999, 0.9999, 0.9999, 1,
];

function springEasing(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return SPRING_SAMPLES[SPRING_SAMPLES.length - 1];
  const idx = t * (SPRING_SAMPLES.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.min(lo + 1, SPRING_SAMPLES.length - 1);
  return SPRING_SAMPLES[lo] + (idx - lo) * (SPRING_SAMPLES[hi] - SPRING_SAMPLES[lo]);
}

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.55,
      touchMultiplier: 1.2,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // ── Snap points + no-snap zones ──────────────────────────────
    let snapPoints: number[] = [];
    let noSnapRanges: [number, number][] = [];

    const buildSnapPoints = () => {
      const pts: number[] = [];
      const zones: [number, number][] = [];
      document.querySelectorAll<HTMLElement>('[data-mask-wrapper="true"]').forEach(wrapper => {
        const wTop = Math.round(wrapper.getBoundingClientRect().top + window.scrollY);
        const curtain = wrapper.querySelector<HTMLElement>('[data-mask-curtain="true"]');
        const curtainH = curtain ? Math.round(curtain.offsetHeight) : window.innerHeight;
        pts.push(wTop);            // curtain completamente visibile
        pts.push(wTop + curtainH); // sezione contenuto completamente rivelata
        if (wrapper.dataset.noSnapInterior === 'true') {
          const wrapperH = Math.round(wrapper.offsetHeight);
          zones.push([wTop + curtainH + 1, wTop + wrapperH - window.innerHeight]);
        }
      });
      snapPoints = pts;
      noSnapRanges = zones;
    };

    const initTimer = setTimeout(buildSnapPoints, 400);
    window.addEventListener('resize', buildSnapPoints, { passive: true });

    // ── Snap al punto stabile più vicino ──────────────────────
    let isSnapping = false;
    let failsafe: ReturnType<typeof setTimeout> | null = null;

    const trySnap = () => {
      if (isSnapping || !snapPoints.length) return;
      const scrollY = window.scrollY;
      // Dentro le zone interne (es. Team / VideoGallery cards) lo snap non scatta
      if (noSnapRanges.some(([start, end]) => scrollY >= start && scrollY <= end)) return;
      let nearest: number | null = null;
      let minDist = Infinity;

      for (const pt of snapPoints) {
        const dist = Math.abs(scrollY - pt);
        if (dist > 6 && dist < window.innerHeight && dist < minDist) {
          minDist = dist;
          nearest = pt;
        }
      }

      if (nearest === null) return;

      isSnapping = true;
      failsafe = setTimeout(() => { isSnapping = false; }, 2000);

      lenis.scrollTo(nearest, {
        duration: 1.24,
        easing: springEasing,
        onComplete: () => {
          isSnapping = false;
          if (failsafe) clearTimeout(failsafe);
        },
      });
    };

    // scrollend nativo (Chrome 114+, FF 109+) — non scatta durante animazioni Lenis
    const onScrollEnd = () => { if (!isSnapping) trySnap(); };

    let debounce: ReturnType<typeof setTimeout> | null = null;
    const onScrollFallback = () => {
      if (isSnapping) return;
      if (debounce) clearTimeout(debounce);
      debounce = setTimeout(onScrollEnd, 180);
    };

    if ('onscrollend' in window) {
      window.addEventListener('scrollend', onScrollEnd, { passive: true });
    } else {
      window.addEventListener('scroll', onScrollFallback, { passive: true });
    }

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(initTimer);
      if (debounce) clearTimeout(debounce);
      if (failsafe) clearTimeout(failsafe);
      window.removeEventListener('resize', buildSnapPoints);
      if ('onscrollend' in window) {
        window.removeEventListener('scrollend', onScrollEnd);
      } else {
        window.removeEventListener('scroll', onScrollFallback);
      }
      lenis.destroy();
    };
  }, []);
}
