import { useRef, useCallback } from 'react';
import { clamp } from '@/lib/math';
import { useCarouselTravel } from '@/hooks/useCarouselTravel';

interface Options {
  count: number;
  isVisible: boolean;
}

export function useScrollTeam({ count, isVisible }: Options) {
  const textRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const photoRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef     = useRef<HTMLSpanElement | null>(null);
  const prevPointerRef = useRef<(boolean | null)[]>(new Array(count).fill(null));

  const applyTravel = useCallback((travel: number) => {
    textRefs.current.forEach((el, i) => {
      if (!el) return;
      const dist = Math.abs(i - travel);
      const opacity = dist <= 0.2 ? 1 : dist < 0.5
        ? (() => { const t = 1 - ((dist - 0.2) / 0.3); return t * t * (3 - 2 * t); })()
        : 0;
      const moveEase   = Math.sign(i - travel) * Math.pow(Math.abs(i - travel), 1.5);
      el.style.opacity   = opacity.toFixed(3);
      el.style.transform = `translateX(${(-moveEase * 100).toFixed(1)}px)`;
      const wantsAuto = opacity > 0.5;
      if (prevPointerRef.current[i] !== wantsAuto) {
        prevPointerRef.current[i] = wantsAuto;
        el.style.pointerEvents = wantsAuto ? 'auto' : 'none';
      }
    });

    photoRefs.current.forEach((el, i) => {
      if (!el) return;
      const dist = Math.abs(i - travel);
      const photoOpacity = clamp(1 - dist, 0, 1);
      const photoScale = clamp(1 - dist * 0.03, 0.97, 1);
      el.style.opacity = photoOpacity.toFixed(3);
      el.style.transform = `scale(${photoScale.toFixed(3)})`;
    });
  }, []);

  const onActiveChange = useCallback((active: number) => {
    const counter = counterRef.current;
    if (!counter) return;
    counter.textContent = `${active + 1}`;
    counter.classList.remove('counter-flash');
    void counter.offsetWidth;
    counter.classList.add('counter-flash');
  }, []);

  const { activeIndex, goNext, goPrev, canGoNext, canGoPrev } = useCarouselTravel({
    count,
    isVisible,
    applyTravel,
    onActiveChange,
    tweenDuration: 0.75,
  });

  return {
    textRefs,
    photoRefs,
    counterRef,
    activeIndex,
    goNext,
    goPrev,
    canGoNext,
    canGoPrev,
  };
}
